import React, { useState, useMemo } from 'react';
import { FormState } from '../types';
import { regions } from '../data/chileanRegions';
import Select from './shared/Select';
import Button from './shared/Button';
import { ChevronLeftIcon, WrenchIcon } from './icons/Icons';

interface Props {
  formData: FormState;
  updateFormData: (update: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const LocationSelector: React.FC<Props> = ({ formData, updateFormData, onNext, onBack, isLoading }) => {
  const [selectedRegion, setSelectedRegion] = useState(formData.region);
  
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionName = e.target.value;
    setSelectedRegion(regionName);
    updateFormData({ region: regionName, comuna: '' }); // Reset comuna when region changes
  };

  const handleComunaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ comuna: e.target.value });
  };
  
  const comunasForSelectedRegion = useMemo(() => {
    const regionData = regions.find(r => r.nombre === selectedRegion);
    return regionData ? regionData.comunas : [];
  }, [selectedRegion]);
  
  const isFormValid = formData.region && formData.comuna;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Finalmente, tu ubicación</h2>
        <p className="text-slate-500 mt-1">Selecciona tu región y comuna para encontrar los mejores talleres y repuestos cerca de ti.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select label="Región" id="region" value={formData.region} onChange={handleRegionChange} required>
            <option value="" disabled>Selecciona una región</option>
            {regions.map(region => (
                <option key={region.nombre} value={region.nombre}>{region.nombre}</option>
            ))}
        </Select>
        <Select label="Comuna" id="comuna" value={formData.comuna} onChange={handleComunaChange} disabled={!selectedRegion} required>
            <option value="" disabled>Selecciona una comuna</option>
            {comunasForSelectedRegion.map(comuna => (
                <option key={comuna} value={comuna}>{comuna}</option>
            ))}
        </Select>
      </div>
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="secondary">
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          <span>Atrás</span>
        </Button>
        <Button onClick={onNext} disabled={!isFormValid || isLoading} isLoading={isLoading}>
          <span>Generar Diagnóstico</span>
          <WrenchIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default LocationSelector;
