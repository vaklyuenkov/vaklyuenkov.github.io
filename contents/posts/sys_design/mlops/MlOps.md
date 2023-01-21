# MlOps

### Instruments

![pipeline](/contents/posts/sys_design/mlops/factorio.gif)

### Dvc
DVC - git for data, .
- performs versioning a relation of code and data, which allows you to reproduce any experiment
- keeps the history of changes of a large dataset (and / or a large model)
- cashes stages of pipeline   
- can load big files from a remote storage (s3 for example)
- every pipeline is a repo in a git

```python
stages:
  prepare:
    cmd: python src/prepare.py data/data.xml
    deps:
    - data/data.xml
    - src/prepare.py
    params:
    - prepare.seed
    - prepare.split
    outs:
    - data/prepared
  featurize:
    cmd: python src/featurization.py data/prepared data/features
    deps:
    - data/prepared
    - src/featurization.py
    params:
    - featurize.max_features
    - featurize.ngrams
    outs:
    - data/features
  train:
    cmd: python src/train.py data/features model.pkl
    deps:
    - data/features
    - src/train.py
    params:
    - train.min_split
    - train.n_est
    - train.seed
    outs:
    - model.pkl
  evaluate:
    cmd: python src/evaluate.py model.pkl data/features
    deps:
    - data/features
    - model.pkl
    - src/evaluate.py
    outs:
    - eval/importance.png
    - eval/live/plots:
        cache: false
    - eval/prc:
        cache: false
    metrics:
    - eval/live/metrics.json:
        cache: false
plots:
  - eval/importance.png
  - Precision-Recall:
      x: recall
      y:
        eval/prc/train.json: precision
        eval/prc/test.json: precision
  - ROC:
      x: fpr
      y:
        eval/live/plots/sklearn/roc/train.json: tpr
        eval/live/plots/sklearn/roc/test.json: tpr
  - Confusion-Matrix:
      template: confusion
      x: actual
      y:
        eval/live/plots/sklearn/cm/train.json: predicted
        eval/live/plots/sklearn/cm/test.json: predicted
```

### MlFlow
MlFlow - experiments tracking with model storage service
- Consists of:
  - tracing service 
    - gets info for all clients that run experiments
    - have ui to show relation of code, data, metadata, models
  - db for save metadata  
    - experiments tags
    - experiments parameters
    - experiments metrics
  - storage (s3, for example) for save:
    - experiments artefacts
      - graphs, confusion matrices 
      - ...
    - models 
      - with versions
      - tags
      - stages (production, stage, archived)

```python
import pandas as pd
from sklearn.model_selection import train_test_split
import mlflow
import mlflow.sklearn
import mlflow.onnx
import catboost
from catboost import CatBoostRegressor
import click

print("MLflow Version:", mlflow.version.VERSION)
print("MLflow Tracking URI:", mlflow.get_tracking_uri())
#print("XGBoost version:",xgb.__version__)
print("Catboost version:",catboost.__version__)
client = mlflow.tracking.MlflowClient()

def build_data(data_path):
    data = pd.read_csv(data_path)
    train, test = train_test_split(data, test_size=0.30, random_state=2019)
    # The predicted column is "quality" which is a scalar from [3, 9]
    X_train = train.drop(["quality"], axis=1)
    X_test = test.drop(["quality"], axis=1)
    y_train = train["quality"]
    y_test = test["quality"]
    return X_train, X_test, y_train, y_test

def train(data_path, iterations, learning_rate, depth, log_as_onnx, model_name):
    X_train, X_test, y_train, _ = build_data(data_path)
    with mlflow.start_run() as run:
        run_id = run.info.run_id
        experiment_id = run.info.experiment_id
        print("MLflow:")
        print("  run_id:", run_id)
        print("  experiment_id:", experiment_id)
        print("  experiment_name:", client.get_experiment(experiment_id).name)

        # MLflow params
        print("Parameters:")
        print("  depth:", depth)
        print("  learning_rate:", learning_rate)
        print("  iterations:", iterations)
        mlflow.log_param("depth", depth)
        mlflow.log_param("learning_rate", learning_rate)
        mlflow.log_param("iterations", iterations)

        # Create and fit model
        model = CatBoostRegressor(iterations=iterations,
                          learning_rate=learning_rate,
                          depth=depth)
        model.fit(X_train, y_train, verbose=False)
        print("model.type=",type(model))

        predictions = model.predict(X_test)
        print("Predictions:",predictions)

        # Log catboost model
        mlflow.sklearn.log_model(model, "catboost-model", registered_model_name=model_name)

        # Log ONNX model
        if log_as_onnx:
            path = "catboost.onnx"
            model.save_model(path, format="onnx")
            with open(path, "rb") as f:
                onnx_model = f.read()
            mlflow.onnx.log_model(onnx_model, "onnx-model", 
                registered_model_name=None if not model_name else f"{model_name}_onnx")


@click.command()
@click.option("--experiment-name", help="Experiment name", default=None, type=str)
@click.option("--data-path", help="Data path", default="../../data/train/wine-quality-white.csv", type=str)
@click.option("--model-name", help="Registered model name", default=None, type=str)
@click.option("--log-as-onnx", help="log_as_onnx", default=False, type=bool)
@click.option("--iterations", help="Iterations", default=2, type=int)
@click.option("--depth", help="Depth", default=2, type=int)
@click.option("--learning-rate", help="Learning rate", default=1, type=int)

def main(experiment_name, data_path, model_name, iterations, depth, learning_rate, log_as_onnx):
    print("Options:")
    for k,v in locals().items():
        print(f"  {k}: {v}")
    model_name = None if not model_name or model_name == "None" else model_name
    if experiment_name:
        mlflow.set_experiment(experiment_name)
    train(data_path, iterations, learning_rate, depth, log_as_onnx, model_name)

if __name__ == "__main__":
    main()
```

### AirFlow

AirFlow is Pipeline Orchestrator
- system with db, scheduler, ui
- launch graphs of stages
  - with conditions 
  - checks dependencies between stages
  - can run pods in kuber as stages
- makes sense when graph nodes are independent (in terms of environment, resources, time)
- use cases
  - continuous re-trainings
  - complex data loads and preparation
  - scheduled batch workers

```python
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

"""
### Tutorial Documentation
Documentation that goes along with the Airflow tutorial located
[here](https://airflow.apache.org/tutorial.html)
"""
# [START tutorial]
# [START import_module]
from datetime import timedelta

# The DAG object; we'll need this to instantiate a DAG
from airflow import DAG

# Operators; we need this to operate!
from airflow.operators.bash import BashOperator
from airflow.utils.dates import days_ago

# [END import_module]

# [START default_args]
# These args will get passed on to each operator
# You can override them on a per-task basis during operator initialization
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email': ['airflow@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
    # 'queue': 'bash_queue',
    # 'pool': 'backfill',
    # 'priority_weight': 10,
    # 'end_date': datetime(2016, 1, 1),
    # 'wait_for_downstream': False,
    # 'dag': dag,
    # 'sla': timedelta(hours=2),
    # 'execution_timeout': timedelta(seconds=300),
    # 'on_failure_callback': some_function,
    # 'on_success_callback': some_other_function,
    # 'on_retry_callback': another_function,
    # 'sla_miss_callback': yet_another_function,
    # 'trigger_rule': 'all_success'
}
# [END default_args]

# [START instantiate_dag]
dag = DAG(
    'tutorial',
    default_args=default_args,
    description='A simple tutorial DAG',
    schedule_interval=timedelta(days=1),
    start_date=days_ago(2),
    tags=['example'],
)
# [END instantiate_dag]

# t1, t2 and t3 are examples of tasks created by instantiating operators
# [START basic_task]
t1 = BashOperator(
    task_id='print_date',
    bash_command='date',
    dag=dag,
)

t2 = BashOperator(
    task_id='sleep',
    depends_on_past=False,
    bash_command='sleep 5',
    retries=3,
    dag=dag,
)
# [END basic_task]

# [START documentation]
dag.doc_md = __doc__

t1.doc_md = """\
#### Task Documentation
You can document your task using the attributes `doc_md` (markdown),
`doc` (plain text), `doc_rst`, `doc_json`, `doc_yaml` which gets
rendered in the UI's Task Instance Details page.
![img](http://montcs.bloomu.edu/~bobmon/Semesters/2012-01/491/import%20soul.png)
"""
# [END documentation]

# [START jinja_template]
templated_command = """
{% for i in range(5) %}
    echo "{{ ds }}"
    echo "{{ macros.ds_add(ds, 7)}}"
    echo "{{ params.my_param }}"
{% endfor %}
"""

t3 = BashOperator(
    task_id='templated',
    depends_on_past=False,
    bash_command=templated_command,
    params={'my_param': 'Parameter I passed in'},
    dag=dag,
)
# [END jinja_template]

t1 >> [t2, t3]
# [END tutorial]
```
