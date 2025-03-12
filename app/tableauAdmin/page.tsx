"use client";


import supabase from "../../lib/supabaseClient";
import { useEffect, useState } from 'react';
import  ResultsTable  from '../components/ResultsTable';
import PerformanceTable from '../components/PerformanceTable';
import StatisticsCard  from '../components/StatisticsCard';


interface Result {
  id: number;
  adherent: string;
  competition: string;
  lieu: string;
  distance: string;
  classement: string;
  date: string;
}

interface Performance {
  id: number;
  adherent: string;
  lieu: string;
  distance: string;
  classement: string;
  date: string;
}

interface Stats {
  participants: number;
  km: number;
  events: number;
  internalPercentage: string;
  externalPercentage: string;
}

interface Event {
  type: 'interne' | 'externe';
}

interface StatisticsCardProps {
  title: string;
  value: number | string;
  className?: string;
}

export default function Dashboard() {
  const [results, setResults] = useState<Result[]>([]);
  const [performance, setPerformance] = useState<Performance[]>([]);
  const [stats, setStats] = useState<Stats>({ participants: 0, km: 0, events: 0, internalPercentage: '0', externalPercentage: '0' });

  useEffect(() => {
    const fetchData = async () => {
      const { data: resultsData } = await supabase.from('results').select('*');
      const { data: performanceData } = await supabase.from('performance').select('*');
      const { data: statsData } = await supabase.from('stats').select('*').single();
      const { data: eventsData } = await supabase.from('evenement').select('type');
      
      const totalEvents = eventsData ? eventsData.length : 0;
      const internalEvents = eventsData ? eventsData.filter((event: Event) => event.type === 'interne').length : 0;
      const externalEvents = totalEvents - internalEvents;
      
      const internalPercentage = totalEvents > 0 ? (internalEvents / totalEvents) * 100 : 0;
      const externalPercentage = totalEvents > 0 ? (externalEvents / totalEvents) * 100 : 0;
      
      setResults(resultsData || []);
      setPerformance(performanceData || []);
      setStats({
        participants: statsData?.participants || 0,
        km: statsData?.km || 0,
        events: totalEvents,
        internalPercentage: internalPercentage.toFixed(2),
        externalPercentage: externalPercentage.toFixed(2)
      });
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-100 min-h-screen">
      <ResultsTable data={results} className="shadow-lg rounded-2xl bg-white p-4" />
      <PerformanceTable data={performance} className="shadow-lg rounded-2xl bg-white p-4" />
      <StatisticsCard title="Nombre de participants par événement" value={stats.participants} className="shadow-lg rounded-2xl bg-white p-4" />
      <StatisticsCard title="Nombre de kilomètres parcourus" value={stats.km} className="shadow-lg rounded-2xl bg-white p-4" />
      <StatisticsCard title="Nombre d'événements" value={stats.events} className="shadow-lg rounded-2xl bg-white p-4" />
      <StatisticsCard title="Événements internes" value={`${stats.internalPercentage} %`} className="shadow-lg rounded-2xl bg-white p-4" />
      <StatisticsCard title="Événements externes" value={`${stats.externalPercentage} %`} className="shadow-lg rounded-2xl bg-white p-4" />
    </div>
  );
}
