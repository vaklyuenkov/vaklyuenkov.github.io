# MultiHead Self-Attention 

### Links 
* [The Illustrated Attention](https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/)
* [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
* [The Annotated Transformer](http://nlp.seas.harvard.edu/2018/04/03/attention.html)

### Statements 

- Self-attention is weighted average of each embedding.
- Self-attention produce new embeddings where each embedding in linear combination of all.
- Attention weights are scaled coefficients for calculate linear combination.
- Embedding, that are generated this way, are contextualized embeddings.
- MultiHead Attention - ensemble by calculating several independent attention.
  - In practice, it turns out that some of attention matrices are very close to the identity matrix, but others do not.
  - The most common merge practice would be to concatenate them and stuff them into a linear layer.
  - MultiHead Self-Attention works good also because split and merge heads are not linear.

### Implementation 

```python
class MultiHeadedAttention(nn.Module):
    # not batched
    def __init__(self, input_dim, n_heads, hidden_dim):
        """
        Inputs:
            input_dim - Dimensionality of the input
            num_heads - Number of heads to use in the attention block
            hidden_dim - Dimensionality of the output
        """
        
        super(MultiHeadedAttention, self).__init__()

        assert hidden_dim % n_heads == 0

        # projections of embeddings to q,k,v
        self.q = nn.Linear(input_dim, hidden_dim)
        self.k = nn.Linear(input_dim, hidden_dim)
        self.v = nn.Linear(input_dim, hidden_dim)
        self.mixing_proj = nn.Linear(hidden_dim, hidden_dim)
        
        self.n_heads = n_heads
        self.hidden_dim = hidden_dim
        
        '''
        Scaling
        If the size of the hidden vector becomes large enough, the values of the unnormalized rates also increase.
        Simply because the more numbers you add, the more varied their sum is - the greater the variance.
        With large softmax values, it becomes very “sharp” - one value is almost equal to one, and the rest are almost zero.
        And since the gradients are proportional to the softmax values,
        the gradients practically do not flow through such a layer and training becomes unstable or just slow.
        This problem can be solved by a simple method - to divide the scores by the root of the dimension.
        Why exactly this value? Because the variance is proportional to the dimension, and the standard deviation is proportional to its square root. 
        In practice, the presence or absence of scaling can turn your neural net from completely untrainable to trainable easy.
        '''
        self.scaling = math.sqrt(hidden_dim / n_heads)

    def forward(self, x):

        seq_len, hidden_dim = x.shape
        k,q,v = self.k(x),  self.q(x), self.v(x)

        # [n_heads, seq_len, hidden_dim // n_heads]
        k = k.reshape(seq_len, self.n_heads, self.hidden_dim // self.n_heads ).transpose(0,1)
        q = q.reshape(seq_len, self.n_heads, self.hidden_dim // self.n_heads ).transpose(0,1)
        v = v.reshape(seq_len, self.n_heads, self.hidden_dim // self.n_heads ).transpose(0,1)
        
        scores = (q@k.transpose(1,2))/self.scaling
        
        p = F.softmax(scores, dim =-1)

        # [n_heads, seq_len, hidden_dim // n_heads]
        attention = p@v

        # [ seq_len, hidden_dim ]
        attention = attention.transpose(0, 1).contiguous().view(seq_len, self.hidden_dim)
        
        # function of layer is to mix different heads
        # [ seq_len, hidden_dim ]
        output = self.mixing_proj(attention)

        #return output, attention
        return output
```