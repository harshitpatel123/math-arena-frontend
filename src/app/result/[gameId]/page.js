import dynamic from 'next/dynamic';

const ResultClient = dynamic(() => import('../../../components/ResultClient'));

export default function ResultPage({ params }) {
  return <ResultClient gameId={params.gameId} />;
}
