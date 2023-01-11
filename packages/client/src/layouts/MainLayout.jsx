import "./MainLayout.css";

export default function MainLayout({ children }) {
  return (
    <main className="MainLayout">
      <section>{children}</section>
    </main>
  );
}
