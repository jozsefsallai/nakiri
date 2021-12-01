import guraLoading from './gura-loading.gif';

import Image from 'next/image';

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-5">
      <Image
        src={guraLoading.src}
        alt="Loading..."
        width={guraLoading.width}
        height={guraLoading.height}
      />
    </div>
  );
};

export default Loading;
