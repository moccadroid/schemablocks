export default function QuoteBlock({ block }) {

  const { id, data } = block;
  return (
    <div>
      <h1>{data.quote}</h1>
    </div>
  )
}
