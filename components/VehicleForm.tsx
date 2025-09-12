import React from 'react';
import { FormState } from '../types';
import Input from './shared/Input';
import Select from './shared/Select';
import Button from './shared/Button';
import { ChevronRightIcon } from './icons/Icons';

interface Props {
  formData: FormState;
  updateFormData: (update: Partial<FormState>) => void;
  onNext: () => void;
}

const VehicleForm: React.FC<Props> = ({ formData, updateFormData, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };
  
  const isFormValid = formData.model && formData.year && formData.mileage;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-bold text-slate-800">Comencemos con tu vehículo</h2>
        <p className="text-slate-500 mt-1">Completa los datos para un diagnóstico más preciso.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Modelo del Vehículo" id="model" name="model" type="text" value={formData.model} onChange={handleChange} placeholder="Ej: Toyota Yaris" required />
        <Select label="Año" id="year" name="year" value={formData.year} onChange={handleChange} required>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </Select>
        <Input label="Kilometraje" id="mileage" name="mileage" type="number" value={formData.mileage} onChange={handleChange} placeholder="Ej: 85000" required />
        <Input label="Patente (Opcional)" id="licensePlate" name="licensePlate" type="text" value={formData.licensePlate} onChange={handleChange} placeholder="Ej: ABCD-12" />
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={onNext} disabled={!isFormValid}>
          <span>Siguiente</span>
          <ChevronRightIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default VehicleForm;
