import pull from 'lodash.pull';
import remove from 'lodash.remove';

export type ToastLevel = 'info' | 'danger' | 'warning' | 'success';

export type ToastEventName = 'create' | 'dismiss' | 'timeouts';

type ToastCallback = (toast: IToast) => void;

export interface IToast {
  id: number;
  level: ToastLevel;
  message: string;
  title?: string;
  dismissable?: boolean;
  dead?: boolean;
};

interface IToastHandlers {
  create: ToastCallback[];
  dismiss: ToastCallback[];
  timeouts: ReturnType<typeof setTimeout>[];
};

class Toaster {
  static DEFAULT_TIMEOUT: number = 10000;

  private idx: number = 0;
  private toasts: IToast[] = [];
  private handlers: IToastHandlers = {
    create: [],
    dismiss: [],
    timeouts: []
  };

  count(): number {
    return this.toasts.length;
  }

  all(): IToast[] {
    return this.toasts.slice(0);
  }

  at(idx: number) {
    return this.toasts[idx];
  }

  $on(event: ToastEventName, handler: ToastCallback | ReturnType<typeof setTimeout>) {
    if (event === 'timeouts') {
      return this.handlers[event].push(handler as ReturnType<typeof setTimeout>);
    }

    return this.handlers[event].push(handler as ToastCallback);
  }

  $off(event: ToastEventName, handler: ToastCallback | ReturnType<typeof setTimeout>) {
    return pull(this.handlers[event], handler);
  }

  $emit(event: ToastEventName, arg: any) {
    return this.handlers[event].forEach(cb => cb(arg));
  }

  create(level: ToastLevel, message: string, title: string | null = null, dismissable: boolean = true) {
    const newToast: IToast = {
      id: this.idx++,
      level,
      message,
      title,
      dismissable
    };

    this.toasts.unshift(newToast);
    this.$emit('create', newToast);

    const timeoutRef: ReturnType<typeof setTimeout> = setTimeout(() => {
      this.destroy(newToast.id);
      return pull(this.handlers.timeouts, timeoutRef);
    }, Toaster.DEFAULT_TIMEOUT);

    this.handlers.timeouts.push(timeoutRef);
  }

  success(message: string, title: string | null = null, dismissable: boolean = true) {
    return this.create('success', message, title, dismissable);
  }

  warning(message: string, title: string | null = null, dismissable: boolean = true) {
    return this.create('warning', message, title, dismissable);
  }

  danger(message: string, title: string | null = null, dismissable: boolean = true) {
    return this.create('danger', message, title, dismissable);
  }

  info(message: string, title: string | null = null, dismissable: boolean = true) {
    return this.create('info', message, title, dismissable);
  }

  destroy(id: number) {
    const removed = remove(this.toasts, { id });

    if (removed.length > 0) {
      return this.$emit('dismiss', removed[0]);
    }
  }

  destroyAllToasts() {
    this.idx = 0;
    this.toasts.length = 0;
    this.handlers.create.length = 0;
    this.handlers.dismiss.length = 0;
    this.handlers.timeouts.forEach(ref => clearTimeout(ref));
    this.handlers.timeouts.length = 0;
  }
}

const toaster = new Toaster();
export default toaster;
