type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
  theme?: "dark" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
  theme = "light",
}: SectionHeadingProps) {
  const isDark = theme === "dark";
  const alignClasses = align === "left" ? "text-left" : "text-center mx-auto";

  return (
    <div className={`mb-12 max-w-3xl ${alignClasses}`}>
      {eyebrow ? (
        <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider ${
          isDark
            ? "border border-slate-800 bg-slate-900 text-slate-300"
            : "border border-slate-200 bg-slate-100 text-slate-700"
        }`}>
          <span>{eyebrow}</span>
        </div>
      ) : null}
      {title ? (
        <h2
          className={`text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl ${
            isDark ? "text-white" : "text-slate-950"
          }`}
        >
          {title}
        </h2>
      ) : null}
      {text ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}
