import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden">
      {/* Decoração de fundo opcional (efeito de luz sutil) 
          Isso dá um toque de design moderno sem precisar de imagens.
      */}
      <div className="absolute top-0 -z-10 h-full w-full bg-white dark:bg-zinc-950">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-blue-500/10 opacity-50 blur-[80px] dark:bg-blue-900/10" />
      </div>

      <div className="w-full px-4">
        {/* Chamada do componente de cliente que criamos anteriormente */}
        <LoginForm />
      </div>
    </div>
  );
}
