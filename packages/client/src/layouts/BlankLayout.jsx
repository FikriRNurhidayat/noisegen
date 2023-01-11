export default function BlankLayout({ children, className, style }) {
  let computedClassName = "BlankLayout";
  if (!!className) computedClassName = `${computedClassName} ${className}`;

  return (
    <main className={computedClassName} style={style}>
      {children}
    </main>
  );
}
