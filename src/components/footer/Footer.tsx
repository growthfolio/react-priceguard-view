import React from "react";
import { Link } from "react-router-dom";
import { FacebookLogo, TwitterLogo, InstagramLogo, GithubLogo, Skull } from "@phosphor-icons/react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-neutral-300 py-12">
      <div className="container mx-auto px-4">
        {/* Divisão Superior */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <h3 className="text-2xl font-bold text-white">PriceGuard</h3>
            </div>
            <p className="text-neutral-400 text-lg mb-6 max-w-md">
              Plataforma inteligente para monitoramento de criptomoedas em tempo real. 
              Tome decisões informadas com alertas personalizados e análises avançadas.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                <FacebookLogo size={20} className="text-neutral-400 group-hover:text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                <TwitterLogo size={20} className="text-neutral-400 group-hover:text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                <InstagramLogo size={20} className="text-neutral-400 group-hover:text-white" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-neutral-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-200 group"
              >
                <GithubLogo size={20} className="text-neutral-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/home" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/market" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm">
                  Mercado
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm">
                  Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Suporte</h3>
            <ul className="space-y-3">
              <li>
                <a href="/help" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="/contact" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm">
                  Contato
                </a>
              </li>
              <li>
                <a href="/faq" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-neutral-400 hover:text-primary-400 transition-colors text-sm">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha Divisória */}
        <hr className="border-neutral-700 my-8" />

        {/* Divisão Inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PriceGuard. Todos os direitos reservados.
          </p>
          <p className="text-sm text-neutral-500 flex items-center gap-2">
            Feito com <Skull size={18} className="text-primary-400" /> por{" "}
            <a href="https://github.com/" className="text-primary-400 hover:text-primary-300 transition-colors font-medium">
              Nossa Equipe
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
