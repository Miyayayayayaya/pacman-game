import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../components/RankingBoard.module.css'

type RankingEntry = {
    id: number;
    userName: string;
    score: number;
    stage: number;
};

export default function RankingBoard() {
    const [rankings, setRankings] = useState<RankingEntry[]>([]);
    const [viewStage, setViewStage] = useState<number>(1); // 1, 2, 0(Total)
    const navigate=useNavigate()

    const fetchRankings = async (stage: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/ranking/${stage}`);
            const data = await response.json();
            const top10=data.sort((a:RankingEntry,b:RankingEntry)=>a.score-b.score).slice(0,10);
            setRankings(top10);
        } catch (e) {
            console.error("Failed to fetch rankings", e);
        }
    };
    useEffect(() => {
        fetchRankings(viewStage);
    }, [viewStage]);
    return (
        <div className={styles.rankingPage}>
            <h1 className={styles.title}>ONLINE RANKING</h1>
            <div className={styles.tabContainer}>
                {[1,2,0].map((s)=>(
                    <button key={s} onClick={()=>setViewStage(s)}
                    className={viewStage===s?styles.activeTab:styles.tab}>
                        {s===0?'TOTAL':`STAGE ${s}`}
                    </button>
                ))}
            </div>
            <div className={styles.scrollWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>RANK</th>
                            <th>NAME</th>
                            <th>TIME (SEC)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map((entry,index)=>(
                            <tr key={entry.id} className={styles.row}>
                                <td className={styles.rankNum}>{index+1}</td>
                                <td className={styles.userName}>{entry.userName}</td>
                                <td className={styles.score}>{entry.score.toFixed(5)}s</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button 
            onClick={()=>navigate('/')}
            className={styles.backButton}>
                BACK TO GAME
            </button>
        </div>
    );
}