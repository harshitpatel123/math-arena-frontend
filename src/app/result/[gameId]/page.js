import dynamic from 'next/dynamic';

const ResultClient = dynamic(() => import('../../../components/ResultClient'));

export default async function ResultPage({ params }) {
  const { gameId } = await params;
  return <ResultClient gameId={gameId} />;
}
