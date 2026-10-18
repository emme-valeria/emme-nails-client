import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFBF9] text-[#1D1D1F] p-4 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-xl text-center space-y-5">
            <div className="size-14 mx-auto rounded-2xl bg-pink-50 text-[#E05286] flex items-center justify-center border border-pink-100/80">
              <AlertTriangle className="size-7 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-[#1D1D1F] tracking-tight">
                Emme Studio Nails
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
                Ocurrió un detalle temporal al cargar la vista. Puedes restaurar la pantalla de inicio o reiniciar la aplicación.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 min-h-[44px] h-11 rounded-xl bg-[#E05286] hover:bg-[#d04377] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                <Home className="size-4" />
                <span>Ir al Inicio</span>
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="min-h-[44px] h-11 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1D1D1F] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className="size-4" />
                <span>Recargar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
