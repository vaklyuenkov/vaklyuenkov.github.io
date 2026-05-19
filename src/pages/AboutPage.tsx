import { useState } from "react";
import { FileText, Github, Linkedin, Mail, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { publicUrl } from "@/lib/public-url";
import { cn } from "@/lib/utils";

const links = [
  { href: "mailto:vaklyuenkov@gmail.com", label: "Email", icon: Mail },
  { href: "https://t.me/vaklyuenkov", label: "Telegram", icon: Send },
  { href: "https://github.com/vaklyuenkov", label: "GitHub", icon: Github },
  {
    href: "https://www.linkedin.com/in/vladimir-klyuenkov-3b1976170/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://drive.google.com/file/d/1Ar0uCUp1kOjOEP7s0u7TO1PtmMyP4urb/view?usp=sharing",
    label: "CV / portfolio (Drive)",
    icon: FileText,
  },
] as const;

const iconClass =
  "size-5 text-muted-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm";

export function AboutPage() {
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-10 py-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div
          className={cn(
            "relative aspect-square w-40 overflow-hidden rounded-2xl border border-border/80 bg-muted/20 sm:w-44",
            !photoOk && "flex items-center justify-center",
          )}
        >
          {photoOk ? (
            <img
              src={publicUrl("myphoto.gif")}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setPhotoOk(false)}
            />
          ) : (
            <span className="px-4 font-mono text-[10px] text-muted-foreground">
              Add <span className="text-accent">public/myphoto.gif</span>
            </span>
          )}
        </div>
        <div className="space-y-3">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Vladimir Klyuenkov</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">AI/ML/DS. Personal dashboards and experiments.</p>
        </div>
      </div>

      <div className="flex justify-center gap-4 border-t border-border/60 pt-8">
        {links.map(({ href, label, icon: Icon }) => {
          const external = href.startsWith("http");
          return (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  aria-label={label}
                  className={iconClass}
                >
                  <Icon strokeWidth={1.75} />
                </a>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
