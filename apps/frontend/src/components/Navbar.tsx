import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border transition-shadow">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="font-display font-800 text-lg md:text-xl text-primary tracking-tight">
          cadus<span className="text-highlight">.</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/entrar" className="btn-ghost text-[13px] md:text-sm py-1.5 px-3 md:py-2 md:px-4">
            Entrar
          </Link>
          <Link to="/cadastro" className="btn-primary text-[13px] md:text-sm py-1.5 px-4 md:py-2 md:px-5 min-h-[36px] md:min-h-[40px]">
            Cadastrar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
