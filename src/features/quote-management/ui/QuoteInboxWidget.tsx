import React, { useState } from 'react';
import { QuoteRequest, Quote } from '@/domain/quotes/entities/QuoteRequest';
import { QuoteStatus, QUOTE_STATUS_LABELS } from '@/domain/quotes/value-objects/QuoteStatus';
import { QuoteBuilderWidget } from './QuoteBuilderWidget';
import { Sparkles, Inbox, Clock, User, Camera, Check, Search, Filter } from 'lucide-react';

interface QuoteInboxWidgetProps {
  requests?: QuoteRequest[];
  onQuoteCreated?: (quote: Quote) => void;
}

export function QuoteInboxWidget({ requests: initialRequests = [], onQuoteCreated }: QuoteInboxWidgetProps) {
  const defaultMockRequests: QuoteRequest[] = [
    {
      id: 'req-101',
      clientId: 'c-1',
      clientName: 'Sofia Ramos',
      clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      serviceId: 'srv-1',
      serviceTitle: 'Acrílico Esculpido Custom',
      nailConfig: {
        nailType: 'extension',
        length: 'long',
        shape: 'coffin',
        existingProductToRemove: true,
        brokenNailsCount: 1,
      },
      designDetails: {
        colors: ['#E8A0BF', '#000000'],
        finish: 'chrome',
        complexity: '3d_charms',
        charmsGems: true,
        sameDesignEveryNail: false,
        description: 'Efecto cromo rosa con pedrería Swarovski en dedos anulares e índices.',
      },
      referenceImages: [
        'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
        'https://images.unsplash.com/photo-1632345031435-8727fec88a5c?w=400&q=80',
      ],
      schedulePref: {
        preferredDate: '2026-08-20',
        preferredTimeRange: 'afternoon',
        isFlexible: true,
      },
      status: 'SUBMITTED',
      createdAt: '2026-08-11T20:15:00Z',
    },
    {
      id: 'req-102',
      clientId: 'c-2',
      clientName: 'Camila Torres',
      clientAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
      serviceId: 'srv-2',
      serviceTitle: 'Gel Soft Extensions',
      nailConfig: {
        nailType: 'extension',
        length: 'medium',
        shape: 'almond',
        existingProductToRemove: false,
        brokenNailsCount: 0,
      },
      designDetails: {
        colors: ['#FFFFFF'],
        finish: 'glossy',
        complexity: 'french',
        charmsGems: false,
        sameDesignEveryNail: true,
        description: 'Francés blanco clásico con baño de gel de brillo intenso.',
      },
      referenceImages: ['https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&q=80'],
      schedulePref: {
        preferredDate: '2026-08-21',
        preferredTimeRange: 'morning',
        isFlexible: false,
      },
      status: 'NEEDS_INFORMATION',
      createdAt: '2026-08-11T19:30:00Z',
    },
  ];

  const [requestsList, setRequestsList] = useState<QuoteRequest[]>(
    initialRequests.length > 0 ? initialRequests : defaultMockRequests
  );
  const [selectedRequestId, setSelectedRequestId] = useState<string>('req-101');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const selectedRequest = requestsList.find((r) => r.id === selectedRequestId) || requestsList[0];

  const handleSendOfficialQuote = (quote: Quote) => {
    setRequestsList((prev) =>
      prev.map((r) => (r.id === quote.quoteRequestId ? { ...r, status: 'SENT_TO_CLIENT' } : r))
    );
    if (onQuoteCreated) onQuoteCreated(quote);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Inbox Request List Panel */}
      <div className="lg:col-span-5 space-y-3">
        <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="size-4 text-primary" />
              <h3 className="text-xs font-extrabold text-foreground">Bandeja de Cotizaciones ({requestsList.length})</h3>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 text-[11px] font-bold">
            {['ALL', 'SUBMITTED', 'NEEDS_INFORMATION', 'SENT_TO_CLIENT'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer shrink-0 ${
                  activeFilter === f
                    ? 'bg-primary text-white border-primary'
                    : 'bg-secondary/60 text-muted-foreground border-border/60 hover:bg-secondary'
                }`}
              >
                {f === 'ALL' ? 'Todas' : QUOTE_STATUS_LABELS[f as QuoteStatus]?.label || f}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {requestsList
              .filter((r) => activeFilter === 'ALL' || r.status === activeFilter)
              .map((req) => {
                const isSelected = req.id === selectedRequestId;
                const statusMeta = QUOTE_STATUS_LABELS[req.status];
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequestId(req.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                        : 'border-border/60 hover:border-primary/40 bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={req.clientAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'}
                          alt={req.clientName}
                          className="size-7 rounded-full object-cover shrink-0"
                        />
                        <span className="text-xs font-extrabold text-foreground truncate">{req.clientName}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusMeta?.bg} ${statusMeta?.color}`}>
                        {statusMeta?.label}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-primary truncate">{req.serviceTitle}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{req.designDetails.description}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Quote Builder / Detail Inspector Panel */}
      <div className="lg:col-span-7 space-y-4">
        {selectedRequest ? (
          <div className="space-y-4">
            {/* Request Details Preview Card */}
            <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-start pb-2 border-b border-border/40">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Solicitud #{selectedRequest.id}</span>
                  <h4 className="text-sm font-extrabold text-foreground">{selectedRequest.serviceTitle}</h4>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {selectedRequest.schedulePref.preferredDate} ({selectedRequest.schedulePref.preferredTimeRange})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-2xl bg-secondary/40 text-[11px]">
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase">Largo & Forma:</span>
                  <span className="font-bold text-foreground">{selectedRequest.nailConfig.length} • {selectedRequest.nailConfig.shape}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase">Acabado & Art:</span>
                  <span className="font-bold text-foreground">{selectedRequest.designDetails.finish} • {selectedRequest.designDetails.complexity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase">Remoción:</span>
                  <span className="font-bold text-foreground">{selectedRequest.nailConfig.existingProductToRemove ? 'Sí' : 'No'}</span>
                </div>
              </div>

              {/* Reference Images Gallery */}
              {selectedRequest.referenceImages.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Fotos de Referencia Adjuntas:</span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {selectedRequest.referenceImages.map((img, i) => (
                      <img key={i} src={img} alt="Ref" className="size-16 rounded-xl object-cover border border-border/60 shrink-0" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Official Builder */}
            <QuoteBuilderWidget
              request={selectedRequest}
              onSendOfficialQuote={handleSendOfficialQuote}
            />
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-card border border-border/60 text-center text-muted-foreground text-xs">
            Selecciona una solicitud de la lista para cotizar.
          </div>
        )}
      </div>
    </div>
  );
}
