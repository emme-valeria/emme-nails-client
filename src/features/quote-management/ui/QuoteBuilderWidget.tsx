import React, { useState } from 'react';
import { QuoteRequest, Quote, QuoteItem } from '@/domain/quotes/entities/QuoteRequest';
import { Sparkles, DollarSign, Clock, Calendar, Send, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '@emme/ui/button';
import { Input } from '@emme/ui/input';

interface QuoteBuilderWidgetProps {
  request: QuoteRequest;
  onSendOfficialQuote?: (quote: Quote) => void;
  onRequestClarification?: (message: string) => void;
}

export function QuoteBuilderWidget({
  request,
  onSendOfficialQuote,
  onRequestClarification,
}: QuoteBuilderWidgetProps) {
  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: 'Set Base Acrílico Esculpido', amount: 650 },
    { id: '2', description: 'Remoción de producto anterior', amount: 100 },
    { id: '3', description: 'Nail Art Custom (Efecto Cromo)', amount: 150 },
    { id: '4', description: 'Cristales 3D Swarovski (x4 uñas)', amount: 200 },
  ]);

  const [estimatedMins, setEstimatedMins] = useState<number>(150); // 2h 30m
  const [depositAmount, setDepositAmount] = useState<number>(300);
  const [expirationDays, setExpirationDays] = useState<number>(7);
  const [artistNotes, setArtistNotes] = useState<string>(
    'El diseño incluye preparación de lámina, cromo tridimensional e hidratación con aceites orgánicos.'
  );

  const [newItemDesc, setNewItemDesc] = useState<string>('');
  const [newItemAmount, setNewItemAmount] = useState<string>('');
  const [clarificationText, setClarificationText] = useState<string>('');
  const [showClarificationBox, setShowClarificationBox] = useState<boolean>(false);

  const subtotal = items.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBalance = Math.max(0, subtotal - depositAmount);

  const handleAddItem = () => {
    if (!newItemDesc || !newItemAmount) return;
    setItems([
      ...items,
      { id: Date.now().toString(), description: newItemDesc, amount: parseFloat(newItemAmount) || 0 },
    ]);
    setNewItemDesc('');
    setNewItemAmount('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSendQuote = () => {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + expirationDays);

    const officialQuote: Quote = {
      id: `quote-${Date.now()}`,
      quoteRequestId: request.id,
      clientId: request.clientId,
      staffId: 'staff-1',
      staffName: 'Valeria M. (Nail Artist Master)',
      status: 'SENT_TO_CLIENT',
      items,
      subtotal,
      discount: 0,
      totalPrice: subtotal,
      requiredDeposit: depositAmount,
      remainingBalance,
      estimatedDurationMinutes: estimatedMins,
      expirationDate: expDate.toISOString().split('T')[0],
      artistNotes,
      createdAt: new Date().toISOString(),
    };

    if (onSendOfficialQuote) onSendOfficialQuote(officialQuote);
  };

  return (
    <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
            EM
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-foreground">Creador de Cotización Oficial del Salón</h3>
            <p className="text-[11px] text-muted-foreground">Cliente: {request.clientName || 'Cliente VIP'}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          Modo Manicurista Master
        </span>
      </div>

      {/* Itemized Pricing Table */}
      <div className="space-y-3">
        <label className="text-xs font-extrabold text-foreground flex items-center justify-between">
          <span>1. Desglose de Servicios y Precios (Manual Override):</span>
          <span className="text-primary font-black">Subtotal: ${subtotal} MXN</span>
        </label>

        <div className="space-y-1.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl border border-border/60 bg-secondary/30 flex items-center justify-between gap-2 text-xs"
            >
              <span className="font-semibold text-foreground flex-1">{item.description}</span>
              <span className="font-extrabold text-primary">${item.amount} MXN</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="text-muted-foreground hover:text-rose-500 p-1 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Custom Item Inputs */}
        <div className="flex gap-2 pt-1">
          <Input
            type="text"
            value={newItemDesc}
            onChange={(e) => setNewItemDesc(e.target.value)}
            placeholder="Nuevo concepto o extra..."
            className="flex-1 h-9 rounded-xl text-xs"
          />
          <Input
            type="number"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            placeholder="Precio $"
            className="w-24 h-9 rounded-xl text-xs"
          />
          <Button
            type="button"
            onClick={handleAddItem}
            className="h-9 px-3 rounded-xl bg-secondary text-foreground hover:bg-secondary/80 text-xs font-bold gap-1 cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Agregar</span>
          </Button>
        </div>
      </div>

      {/* Duration, Deposit & Expiration Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-secondary/40 border border-border/40 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-foreground flex items-center gap-1">
            <Clock className="size-3.5 text-primary" />
            <span>Duración Estimada:</span>
          </label>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={estimatedMins}
              onChange={(e) => setEstimatedMins(parseInt(e.target.value) || 60)}
              className="h-8 rounded-lg text-xs font-bold"
            />
            <span className="text-[10px] font-bold text-muted-foreground">min</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-foreground flex items-center gap-1">
            <DollarSign className="size-3.5 text-primary" />
            <span>Depósito Requerido:</span>
          </label>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
              className="h-8 rounded-lg text-xs font-bold"
            />
            <span className="text-[10px] font-bold text-muted-foreground">MXN</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-foreground flex items-center gap-1">
            <Calendar className="size-3.5 text-primary" />
            <span>Vigencia (Días):</span>
          </label>
          <Input
            type="number"
            value={expirationDays}
            onChange={(e) => setExpirationDays(parseInt(e.target.value) || 3)}
            className="h-8 rounded-lg text-xs font-bold"
          />
        </div>
      </div>

      {/* Artist Notes */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-foreground">Notas & Recomendaciones del Manicurista:</label>
        <textarea
          value={artistNotes}
          onChange={(e) => setArtistNotes(e.target.value)}
          rows={2}
          className="w-full p-2.5 rounded-xl bg-secondary/50 border border-border/60 text-xs text-foreground focus:outline-none"
        />
      </div>

      {/* Summary Box */}
      <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
        <div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground">Precio Total Final</p>
          <p className="text-xl font-black text-primary">${subtotal} MXN</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-muted-foreground">Anticipo / Restante</p>
          <p className="font-bold text-foreground">${depositAmount} MXN / ${remainingBalance} MXN</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowClarificationBox(!showClarificationBox)}
          className="rounded-xl text-xs font-bold"
        >
          Solicitar Más Información
        </Button>

        <Button
          type="button"
          onClick={handleSendQuote}
          className="rounded-xl text-xs font-bold bg-primary hover:brightness-105 text-white ml-auto gap-1.5 shadow-xs cursor-pointer"
        >
          <Send className="size-3.5" />
          <span>Enviar Cotización Oficial al Cliente</span>
        </Button>
      </div>

      {showClarificationBox && (
        <div className="p-3 rounded-2xl bg-[#FAF5EC] border border-[#ECDCC2] space-y-2">
          <p className="text-xs font-bold text-[#845E1B]">Mensaje de Aclaración para el Cliente:</p>
          <textarea
            value={clarificationText}
            onChange={(e) => setClarificationText(e.target.value)}
            placeholder="Ej: 'Hola! Podrías enviarme una foto de tus uñas actuales sin esmalte para evaluar si requerimos nivelación extra?'"
            rows={2}
            className="w-full p-2 rounded-xl bg-white border border-black/[0.06] text-xs text-[#1D1D1F]"
          />
          <Button
            type="button"
            onClick={() => {
              if (onRequestClarification && clarificationText) {
                onRequestClarification(clarificationText);
                setShowClarificationBox(false);
              }
            }}
            className="h-8 text-xs font-bold bg-primary hover:brightness-105 text-white rounded-lg cursor-pointer"
          >
            Enviar Duda al Cliente
          </Button>
        </div>
      )}
    </div>
  );
}
