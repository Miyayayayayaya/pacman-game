import { useEffect, useState } from 'react';

type RankingEntry = {
    id: number;
    userName: string;
    score: number;
    stage: number;
};

export default function RankingBoard() {
    const [rankings, setRankings] = useState<RankingEntry[]>([]);
    const [viewStage, setViewStage] = useState<number>(1); // 1, 2, 0(Total)

    const fetchRankings = async (stage: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/ranking/${stage}`);
            const data = await response.json();
            setRankings(data);
        } catch (e) {
            console.error("Failed to fetch rankings", e);
        }
    };
    useEffect(() => {
        fetchRankings(viewStage);
    }, [viewStage]);
    return (
        <div style={{ backgroundColor: '#000', color: '#fff', padding: '20px', fontFamily: 'monospace' }}>
            <h2 style={{ color: '#ff0', textAlign: 'center' }}>🏆 RANKING</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {[1, 2, 0].map((s) => (
                    <button 
                    key={s} 
                    onClick={() => setViewStage(s)}
                    style={{
                        padding: '5px 15px',
                        backgroundColor: viewStage === s ? '#ff0' : '#333',
                        color: viewStage === s ? '#000' : '#fff',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    >
                        {s === 0 ? 'TOTAL' : `STAGE ${s}`}
                    </button>
                ))}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #fff' }}>
                        <th>RANK</th>
                        <th>NAME</th>
                        <th>TIME (SEC)</th>
                    </tr>
                </thead>
            <tbody>
                {rankings.map((entry, index) => (
                    <tr key={entry.id} style={{ textAlign: 'center', borderBottom: '1px solid #444' }}>
                        <td style={{ padding: '10px' }}>{index + 1}</td>
                        <td>{entry.userName}</td>
                        <td style={{ color: '#0f0' }}>{entry.score.toFixed(5)}s</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
}