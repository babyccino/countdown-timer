import { DateDifference } from '../lib/date'

export default function DumbTimer({ diff, title }: {diff: DateDifference, title: string}) {
  return (
    <article className="font-['Montserrat'] flex flex-col justify-center text-center min-w-full px-6 md:px-20 md:pb-2">
      <h1 className="text-3xl md:text-5xl">{title}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 mt-4 md:px-8 md:pt-12">
        {
          ["days", "hours", "minutes", "seconds"].map((val, index) => (
            <div id="days" className="py-4" key={index}>
              <div className="text-8xl md:text-9xl">{ diff[val] }</div>
              <div className="text-2xl">{ val[0].toUpperCase() + val.slice(1) }</div>
            </div>
          ))
        }
      </div>
    </article>
  )
}