import React from 'react';
import { Report, FormState } from '../types';
import Button from './shared/Button';
import { PrinterIcon } from './icons/Icons';

interface Props {
  report: Report;
  vehicleData: FormState;
  onStartNew: () => void;
}

const ReportView: React.FC<Props> = ({ report, vehicleData, onStartNew }) => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            /* Ocultar elementos no deseados de toda la app */
            body > #root > div > div > header,
            body > #root > div > div > main > div:first-child, /* Oculta el stepper */
            .no-print {
              display: none !important;
            }

            /* Resetear estilos para una página limpia */
            body {
              background-color: white !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            #root, #root > div, #root > div > div {
              display: block !important;
              padding: 0 !important;
              margin: 0 !important;
              max-width: 100% !important;
            }
            main {
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
            }

            /* Estilos del contenido imprimible */
            .printable-area {
              padding: 1rem !important;
              color: #000 !important;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #000 !important;
            }
            
            /* Forzar diseño de una columna para las recomendaciones */
            .recommendations-grid {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
            }

            /* Evitar saltos de página inoportunos */
            section, .card {
              break-inside: avoid;
              page-break-inside: avoid;
            }
          }
        `}
      </style>
      <div className="printable-area space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Informe de Diagnóstico</h2>
            <p className="text-slate-500 mt-1">Generado por AI Auto-Diagnóstico</p>
          </div>
          <div className="no-print flex items-center gap-4">
            <Button onClick={onStartNew} variant="secondary">Nuevo Diagnóstico</Button>
            <Button onClick={handlePrint}>
              <PrinterIcon className="w-5 h-5 mr-2" />
              <span>Imprimir / Guardar PDF</span>
            </Button>
          </div>
        </div>

        {/* Vehicle Summary */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Resumen del Vehículo</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><strong>Modelo:</strong> {vehicleData.model}</div>
            <div><strong>Año:</strong> {vehicleData.year}</div>
            <div><strong>Kilometraje:</strong> {vehicleData.mileage} km</div>
            <div><strong>Ubicación:</strong> {vehicleData.comuna}, {vehicleData.region}</div>
          </div>
        </div>

        {/* Probable Diagnosis */}
        <section>
          <h3 className="text-xl font-bold text-sky-600 mb-3 border-b-2 border-sky-200 pb-2">Diagnóstico Probable</h3>
          <p className="text-slate-700 leading-relaxed">{report.probableDiagnosis}</p>
        </section>

        {/* Repair Instructions */}
        <section>
          <h3 className="text-xl font-bold text-sky-600 mb-3 border-b-2 border-sky-200 pb-2">Instrucciones de Reparación</h3>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            {report.repairInstructions.map((step, index) => <li key={index}>{step}</li>)}
          </ol>
        </section>

        {/* Required Parts */}
        <section>
          <h3 className="text-xl font-bold text-sky-600 mb-3 border-b-2 border-sky-200 pb-2">Repuestos Requeridos</h3>
          <div className="space-y-3">
            {report.requiredParts.map((part, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg card">
                <p className="font-semibold text-slate-800">{part.name}</p>
                <p className="text-sm text-slate-600">{part.description}</p>
                {part.estimatedCost && <p className="text-sm text-slate-500 mt-1">Costo estimado: {part.estimatedCost}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 recommendations-grid">
          <section>
            <h3 className="text-xl font-bold text-sky-600 mb-3 border-b-2 border-sky-200 pb-2">Talleres Recomendados</h3>
            <div className="space-y-3">
              {report.recommendedWorkshops.map((shop, index) => (
                <div key={index} className="p-3 border border-slate-200 rounded-lg card">
                  <p className="font-semibold text-slate-800">{shop.name}</p>
                  <p className="text-sm text-slate-600">{shop.address}</p>
                  {shop.phone && <p className="text-sm text-slate-500">Tel: {shop.phone}</p>}
                  {shop.reason && <p className="text-xs text-slate-500 italic mt-1">"{shop.reason}"</p>}
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xl font-bold text-sky-600 mb-3 border-b-2 border-sky-200 pb-2">Casas de Repuestos Sugeridas</h3>
            <div className="space-y-3">
              {report.suggestedPartStores.map((store, index) => (
                <div key={index} className="p-3 border border-slate-200 rounded-lg card">
                  <p className="font-semibold text-slate-800">{store.name}</p>
                  <p className="text-sm text-slate-600">{store.address}</p>
                  {store.phone && <p className="text-sm text-slate-500">Tel: {store.phone}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ReportView;