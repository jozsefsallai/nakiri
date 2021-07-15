import guraLoading from './gura-loading.gif';

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-5">
      <img src={guraLoading.src} alt="Loading..." />
    </div>
  );
};

export default Loading;
