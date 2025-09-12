import React from 'react';
import { HistoryItem } from '../types';
import Button from './shared/Button';
import { ChevronLeftIcon } from './icons/Icons';

interface Props {
  history: HistoryItem[];
  onViewItem: (item: HistoryItem) => void;
  onBack: () => void;
}

const HistoryView: React.FC<Props> = ({ history, onViewItem, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Historial de Diagnósticos</h2>
          <p className="text-slate-500 mt-1">Aquí puedes ver tus consultas anteriores.</p>
        </div>
        <Button onClick={onBack} variant="secondary">
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          <span>Atrás</span>
        </Button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 px-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-semibold text-slate-700">No tienes diagnósticos guardados</h3>
          <p className="text-slate-500 mt-2">Completa tu primer diagnóstico y aparecerá aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-slate-800">{item.formData.model} ({item.formData.year})</p>
                <p className="text-sm text-slate-500">
                  {new Date(item.id).toLocaleString('es-CL', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })} - {item.formData.issueType}
                </p>
              </div>
              <Button onClick={() => onViewItem(item)} className="mt-3 sm:mt-0">
                Ver Informe
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
