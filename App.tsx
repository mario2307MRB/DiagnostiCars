import React, { useState, useCallback } from 'react';
import { FormState, Report, Step, HistoryItem } from './types';
import { generateDiagnosticReport } from './services/geminiService';
import LocationSelector from './components/LocationSelector';
import VehicleForm from './components/VehicleForm';
import QuestionsForm from './components/QuestionsForm';
import ReportView from './components/ReportView';
import HistoryView from './components/HistoryView';
import useLocalStorage from './hooks/useLocalStorage';
import { CarIcon, HistoryIcon, WrenchIcon, MapPinIcon, CheckCircleIcon } from './components/icons/Icons';
import Spinner from './components/shared/Spinner';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('VEHICLE');
  const [formState, setFormState] = useState<FormState>({
    region: '',
    comuna: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    licensePlate: '',
    issueType: '',
    q1: '',
    q2: '',
    q3: '',
    comments: ''
  });
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('diag_history', []);

  const updateFormState = (update: Partial<FormState>) => {
    setFormState(prevState => ({ ...prevState, ...update }));
  };

  const handleNext = () => {
    switch (step) {
      case 'VEHICLE': setStep('QUESTIONS'); break;
      case 'QUESTIONS': setStep('LOCATION'); break;
      case 'LOCATION': handleSubmit(); break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'QUESTIONS': setStep('VEHICLE'); break;
      case 'LOCATION': setStep('QUESTIONS'); break;
      case 'REPORT': setStep('LOCATION'); break;
    }
  };
  
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setStep('GENERATING');
    setError(null);
    try {
      const generatedReport = await generateDiagnosticReport(formState);
      setReport(generatedReport);
      
      const historyItem: HistoryItem = {
        id: new Date().toISOString(),
        formData: formState,
        report: generatedReport,
      };
      setHistory([historyItem, ...history]);
      
      setStep('REPORT');
    } catch (err) {
      setError('Hubo un error al generar el informe. Por favor, revise los datos e inténtelo de nuevo.');
      console.error(err);
      setStep('LOCATION'); // Go back to the last input step on error
    } finally {
      setIsLoading(false);
    }
  }, [formState, history, setHistory]);

  const resetAndStartOver = () => {
    setFormState({
      region: '',
      comuna: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: '',
      licensePlate: '',
      issueType: '',
      q1: '',
      q2: '',
      q3: '',
      comments: ''
    });
    setReport(null);
    setError(null);
    setStep('VEHICLE');
  };

  const viewHistoryItem = (item: HistoryItem) => {
    setFormState(item.formData);
    setReport(item.report);
    setStep('REPORT');
  }

  const renderStep = () => {
    switch (step) {
      case 'VEHICLE':
        return <VehicleForm formData={formState} updateFormData={updateFormState} onNext={handleNext} />;
      case 'QUESTIONS':
        return <QuestionsForm formData={formState} updateFormData={updateFormState} onNext={handleNext} onBack={handleBack} />;
      case 'LOCATION':
        return <LocationSelector formData={formState} updateFormData={updateFormState} onNext={handleNext} onBack={handleBack} isLoading={isLoading} />;
      case 'GENERATING':
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 h-96">
            <Spinner />
            <h2 className="text-2xl font-bold text-slate-700 mt-6">Generando diagnóstico con IA...</h2>
            <p className="text-slate-500 mt-2">Esto puede tomar un momento. Estamos analizando los datos de tu vehículo.</p>
          </div>
        );
      case 'REPORT':
        return report && <ReportView report={report} vehicleData={formState} onStartNew={resetAndStartOver} />;
      case 'HISTORY':
        return <HistoryView history={history} onViewItem={viewHistoryItem} onBack={resetAndStartOver} />;
      default:
        return <div>Paso desconocido</div>;
    }
  };

  const steps = [
    { id: 'VEHICLE', name: 'Vehículo', icon: <CarIcon /> },
    { id: 'QUESTIONS', name: 'Síntomas', icon: <WrenchIcon /> },
    { id: 'LOCATION', name: 'Ubicación', icon: <MapPinIcon /> },
    { id: 'REPORT', name: 'Diagnóstico', icon: <CheckCircleIcon /> }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step || (step === 'GENERATING' && s.id === 'REPORT') );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="bg-sky-500 p-2 rounded-lg">
              <WrenchIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">AI Auto-Diagnóstico</h1>
          </div>
          <button
            onClick={() => step === 'HISTORY' ? resetAndStartOver() : setStep('HISTORY')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <HistoryIcon className="w-5 h-5" />
            <span>{step === 'HISTORY' ? 'Nuevo Diagnóstico' : 'Historial'}</span>
          </button>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <main className="bg-white rounded-xl shadow-lg overflow-hidden">
          {(step !== 'REPORT' && step !== 'HISTORY' && step !== 'GENERATING') && (
             <div className="p-6 border-b border-slate-200">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center">
                        {steps.map((s, index) => (
                            <li key={s.name} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''} flex-1`}>
                                {index < currentStepIndex && (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-sky-500"></div>
                                        </div>
                                        <div className="relative w-8 h-8 flex items-center justify-center bg-sky-500 rounded-full cursor-pointer" onClick={() => setStep(s.id as Step)}>
                                            {React.cloneElement(s.icon, { className: 'w-5 h-5 text-white' })}
                                        </div>
                                    </>
                                )}
                                {index === currentStepIndex && (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-slate-200"></div>
                                        </div>
                                        <div className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-sky-500 rounded-full">
                                            {React.cloneElement(s.icon, { className: 'w-5 h-5 text-sky-500' })}
                                        </div>
                                        <span className="absolute text-center w-full -bottom-6 text-xs text-sky-600 font-semibold">{s.name}</span>
                                    </>
                                )}
                                {index > currentStepIndex && (
                                    <>
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="h-0.5 w-full bg-slate-200"></div>
                                        </div>
                                        <div className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-slate-300 rounded-full">
                                            {React.cloneElement(s.icon, { className: 'w-5 h-5 text-slate-400' })}
                                        </div>
                                        <span className="absolute text-center w-full -bottom-6 text-xs text-slate-500">{s.name}</span>
                                    </>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
             </div>
          )}

          <div className="p-4 sm:p-8">
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
