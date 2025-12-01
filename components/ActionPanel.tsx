import React from 'react';
import { TriageData, UrgencyLevel } from '../types';
import { VET_PHONE_NUMBER, CAL_LINK_HOME, CAL_LINK_VIDEO } from '../constants';

interface ActionPanelProps {
  data: TriageData;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ data }) => {
  const isUrgent = data.urgency === UrgencyLevel.HIGH || data.urgency === UrgencyLevel.UNKNOWN;

  const handleWhatsAppClick = () => {
    const text = `Hola Sofía, te contacto por el siguiente caso: 🐾\n\n*${data.pet}*\n${data.fullSummary}`;
    const url = `https://wa.me/${VET_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleBookingClick = (link: string) => {
    if (window.Cal) {
      window.Cal("modal", {
        calLink: link,
        config: {
          name: data.name,
          notes: `Tel: ${data.phone}\nMascota: ${data.pet}\nSíntomas: ${data.symptoms}\nDirección: ${data.address}`
        }
      });
    } else {
        window.open(`https://cal.com/${link}`, '_blank');
    }
  };

  return (
    <div className="w-full animate-[slideUpFade_0.5s_ease-out]">
      {isUrgent ? (
        <>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4 flex gap-3 items-start shadow-sm">
              <div className="bg-amber-100 p-2 rounded-full shrink-0 text-amber-600">
                  <i className="fa-solid fa-heart-pulse"></i>
              </div>
              <div>
                  <h3 className="font-semibold text-amber-900 text-sm mb-1">Recomendación</h3>
                  <p className="text-sm text-amber-800/80 leading-snug">
                      Por los síntomas que me comentás, prefiero que hablemos directamente para atender a {data.pet} lo antes posible.
                  </p>
              </div>
          </div>
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white font-semibold py-4 rounded-2xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-3 mb-2"
          >
            <i className="fa-brands fa-whatsapp text-2xl"></i>
            <span className="text-lg">Contactar ahora</span>
          </button>
        </>
      ) : (
        <>
          <p className="text-center text-sm text-gray-500 mb-2 font-medium">¿Cómo preferís la consulta?</p>
          
          <div className="grid grid-cols-2 gap-3 mb-2">
            <button
              onClick={() => handleBookingClick(CAL_LINK_HOME)}
              className="relative bg-white border border-gray-100 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 active:scale-[0.98] text-gray-700 py-4 px-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                 <i className="fa-solid fa-house-medical text-xl"></i>
              </div>
              <span className="text-sm font-semibold">A Domicilio</span>
            </button>

            <button
              onClick={() => handleBookingClick(CAL_LINK_VIDEO)}
              className="relative bg-white border border-gray-100 hover:border-teal-500 hover:ring-1 hover:ring-teal-500 active:scale-[0.98] text-gray-700 py-4 px-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2 group"
            >
               <div className="bg-teal-50 text-teal-600 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <i className="fa-solid fa-video text-xl"></i>
               </div>
              <span className="text-sm font-semibold">Videollamada</span>
            </button>
          </div>
          
          <div className="flex justify-center mb-3">
            <span className="text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
               <i className="fa-regular fa-clock mr-1"></i>
               Sujeto a disponibilidad de agenda
            </span>
          </div>
        </>
      )}

      {/* Compromiso de Servicio Disclaimer */}
      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3 items-start">
          <i className="fa-solid fa-circle-info text-blue-500 mt-0.5 text-xs"></i>
          <p className="text-[11px] text-blue-800 leading-snug">
              <strong>Importante:</strong> La reserva de un turno o la solicitud de urgencia implica un compromiso de servicio. Por favor, avisanos con tiempo si necesitás cancelar.
          </p>
      </div>

    </div>
  );
};