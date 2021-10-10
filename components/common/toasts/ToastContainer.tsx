import Toast from '@/components/common/toasts/Toast';

import toaster, { IToast } from '@/lib/toaster';
import { useEffect, useState } from 'react';

import remove from 'lodash.remove';

const ToastContainer = () => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const handleCreate = () => {
    setToasts((toasts) => {
      const newToasts = toasts.slice(0);

      toaster.all().forEach((toast) => {
        if (!toasts.find((t) => t.id === toast.id)) {
          newToasts.unshift(toast);
        }
      });

      let idx = 0;

      newToasts.forEach((toast) => {
        if (!toast.dead) {
          toast.id = idx++;
        }
      });

      return newToasts;
    });
  };

  const handleDismiss = (removed: IToast) => {
    setToasts((toasts) => {
      let newToasts = toasts.slice(0);
      const removedToast = newToasts.find((toast) => toast.id === removed.id);

      if (removedToast) {
        remove(newToasts, { id: removed.id });
      }

      let idx = 0;

      newToasts.forEach((toast) => {
        if (!toast.dead) {
          toast.id = idx++;
        }
      });

      return newToasts;
    });
  };

  const handleDismissClick = (id: number) => toaster.destroy(id);

  useEffect(() => {
    toaster.$on('create', handleCreate);
    toaster.$on('dismiss', handleDismiss);
  }, []);

  return (
    <div
      id="toast-container"
      className="fixed bottom-0 left-1/2 w-full md:w-[400px]"
      style={{ transform: 'translateX(-50%)' }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          idx={toast.id}
          level={toast.level}
          title={toast.title}
          message={toast.message}
          dismissable={toast.dismissable}
          dead={toast.dead}
          onClick={() => handleDismissClick(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
