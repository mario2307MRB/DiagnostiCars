import React from 'react';
import { FormState } from '../types';
import Select from './shared/Select';
import Textarea from './shared/Textarea';
import Button from './shared/Button';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

interface Props {
  formData: FormState;
  updateFormData: (update: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const QuestionsForm: React.FC<Props> = ({ formData, updateFormData, onNext, onBack }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };
  
  const isFormValid = formData.issueType && formData.q1 && formData.q2 && formData.q3;

  const issueTypes = [
    'Motor (ruidos, pérdida de potencia, etc.)',
    'Frenos (ruidos, vibraciones, no frena bien)',
    'Suspensión y Dirección (ruidos, inestabilidad)',
    'Sistema Eléctrico (luces, batería, arranque)',
    'Transmisión (cambios bruscos, no avanza)',
    'Sistema de Enfriamiento (sobrecalentamiento)',
    'Otro (describir en comentarios)',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Describe los síntomas</h2>
        <p className="text-slate-500 mt-1">Tus respuestas nos ayudarán a refinar el diagnóstico.</p>
      </div>
      <div className="space-y-6">
        <Select label="Tipo de falla o problema principal" id="issueType" name="issueType" value={formData.issueType} onChange={handleChange} required>
          <option value="" disabled>Selecciona una categoría</option>
          {issueTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </Select>

        <Select label="1. ¿Cuándo ocurre principalmente el problema?" id="q1" name="q1" value={formData.q1} onChange={handleChange} required>
          <option value="" disabled>Selecciona una opción</option>
          <option>Al encender el auto en frío</option>
          <option>Después de que el auto se calienta</option>
          <option>Al acelerar</option>
          <option>Al frenar</option>
          <option>Al girar el volante</option>
          <option>Es constante, en todo momento</option>
          <option>Ocurre de forma intermitente</option>
        </Select>
        <Select label="2. ¿Notas algún ruido, olor o vibración extraña?" id="q2" name="q2" value={formData.q2} onChange={handleChange} required>
          <option value="" disabled>Selecciona una opción</option>
          <option>Sí, un ruido metálico o chirrido</option>
          <option>Sí, un golpeteo</option>
          <option>Sí, una vibración en el volante o en el auto</option>
          <option>Sí, olor a quemado o a combustible</option>
          <option>No, no hay ruidos, olores ni vibraciones</option>
          <option>Otro (describir en comentarios)</option>
        </Select>
        <Select label="3. ¿Se ha encendido alguna luz de advertencia en el tablero?" id="q3" name="q3" value={formData.q3} onChange={handleChange} required>
          <option value="" disabled>Selecciona una opción</option>
          <option>Sí, la luz de Check Engine</option>
          <option>Sí, la luz de la batería</option>
          <option>Sí, la luz del aceite</option>
          <option>Sí, la luz de temperatura</option>
          <option>Sí, la luz de ABS o frenos</option>
          <option>No, ninguna luz está encendida</option>
          <option>Otra luz (describir en comentarios)</option>
        </Select>
        <Textarea label="Comentarios adicionales (aclaración libre)" id="comments" name="comments" value={formData.comments} onChange={handleChange} placeholder="Añade cualquier otro detalle que consideres importante..." />
      </div>
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="secondary">
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          <span>Atrás</span>
        </Button>
        <Button onClick={onNext} disabled={!isFormValid}>
          <span>Siguiente</span>
          <ChevronRightIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default QuestionsForm;
