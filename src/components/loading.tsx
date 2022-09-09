import { Watch } from  'react-loader-spinner'

export default function Loading(): JSX.Element {
  return (
    <Watch
      height="80"
      width="80"
      radius="48"
      color="#4F46E5"
      ariaLabel="watch-loading"
      wrapperClass="fixed top-1/2 left-1/2 z-10"
      visible={true}
    />
  )
}