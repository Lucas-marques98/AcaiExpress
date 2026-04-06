import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Truck, 
  Store, 
  User, 
  Phone, 
  MapPinned, 
  CreditCard, 
  Send, 
  MapPin, 
  CheckCircle2, 
  ChevronDown, 
  MessageSquare 
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';
import { formatCurrency, cn } from '../lib/utils';
import { Button } from '../components/Button';
import { toast } from 'sonner';
import { DeliveryMethod, PaymentMethod } from '../types';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { currentStore, neighborhoods, addOrder } = useStore();
  
  const [step, setStep] = useState<'details' | 'confirmation'>('details');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState({ street: '', number: '', neighborhoodId: '', complement: '', reference: '' });
  const [changeFor, setChangeFor] = useState('');
  const [orderObservations, setOrderObservations] = useState('');

  const selectedNeighborhood = useMemo(() => 
    neighborhoods.find(n => n.id === address.neighborhoodId),
    [address.neighborhoodId, neighborhoods]
  );

  const deliveryFee = deliveryMethod === 'delivery' ? (selectedNeighborhood?.deliveryFee || 0) : 0;
  const total = cartTotal + deliveryFee;

  if (cart.length === 0) {
    navigate('/carrinho');
    return null;
  }

  const validateCheckout = () => {
    if (!customerName.trim()) {
      toast.error('Por favor, informe seu nome');
      return false;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      toast.error('Informe um telefone válido com DDD');
      return false;
    }
    if (deliveryMethod === 'delivery') {
      if (!address.street.trim()) {
        toast.error('Informe a rua para entrega');
        return false;
      }
      if (!address.number.trim()) {
        toast.error('Informe o número da residência');
        return false;
      }
      if (!address.neighborhoodId) {
        toast.error('Selecione o bairro para entrega');
        return false;
      }
    }
    if (paymentMethod === 'money' && (!changeFor || Number(changeFor) < total)) {
      toast.error(`O valor para troco deve ser maior que ${formatCurrency(total)}`);
      return false;
    }
    return true;
  };

  const handleFinishOrder = () => {
    const itemsText = cart.map(item => {
      let text = `*${item.quantity}x ${item.name}*`;
      if (item.variation) text += ` (${item.variation.name})`;
      if (item.addons.length > 0) {
        item.addons.forEach(group => {
          text += `\n  - ${group.groupName}: ${group.items.map(i => i.name).join(', ')}`;
        });
      }
      if (item.observations) text += `\n  _Obs item: ${item.observations}_`;
      text += `\n  Subtotal: ${formatCurrency(item.totalPrice)}`;
      return text;
    }).join('\n\n');

    let deliveryText = '';
    if (deliveryMethod === 'delivery') {
      deliveryText = `*Tipo de Pedido:* Delivery\n*Endereço:* ${address.street}, ${address.number}\n*Bairro:* ${selectedNeighborhood?.name}\n${address.complement ? `*Comp:* ${address.complement}\n` : ''}${address.reference ? `*Ref:* ${address.reference}` : ''}`;
    } else {
      deliveryText = `*Tipo de Pedido:* ${deliveryMethod === 'pickup' ? 'Retirada na Loja' : 'Consumir no Local'}`;
    }

    const paymentText = `*Forma de Pagamento:* ${
      paymentMethod === 'pix' ? 'PIX' : 
      paymentMethod === 'card_credit' ? 'Cartão de Crédito' : 
      paymentMethod === 'card_debit' ? 'Cartão de Débito' : 'Dinheiro'
    }${changeFor ? ` (Troco para ${formatCurrency(Number(changeFor))})` : ''}`;

    const message = encodeURIComponent(
      `*NOVO PEDIDO - AÇAÍ EXPRESS PRO*\n` +
      `--------------------------------\n` +
      `*CLIENTE:* ${customerName}\n` +
      `*TELEFONE:* ${customerPhone}\n` +
      `--------------------------------\n` +
      `${itemsText}\n` +
      `--------------------------------\n` +
      `*Subtotal:* ${formatCurrency(cartTotal)}\n` +
      `*Taxa de Entrega:* ${formatCurrency(deliveryFee)}\n` +
      `*TOTAL:* ${formatCurrency(total)}\n` +
      `--------------------------------\n` +
      `${deliveryText}\n` +
      `${paymentText}\n` +
      `${orderObservations ? `--------------------------------\n*OBSERVAÇÕES FINAIS:*\n${orderObservations}\n` : ''}` +
      `--------------------------------\n` +
      `_Pedido gerado via Cardápio Digital_`
    );

    window.open(`https://wa.me/${currentStore?.whatsapp}?text=${message}`, '_blank');
    
    addOrder({
      items: cart,
      total,
      customerName,
      customerPhone,
      deliveryMethod,
      paymentMethod,
      address: deliveryMethod === 'delivery' ? {
        street: address.street,
        number: address.number,
        neighborhood: selectedNeighborhood?.name || '',
        complement: address.complement,
        reference: address.reference
      } : undefined,
      observations: orderObservations,
      subtotal: cartTotal,
      deliveryFee: deliveryFee
    });

    toast.success('Pedido enviado com sucesso!');
    clearCart();
    navigate('/pedido/sucesso');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] pb-32 transition-colors duration-500">
      <header className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-white/10 px-4 py-4 flex items-center gap-4">
        <button onClick={() => step === 'confirmation' ? setStep('details') : navigate('/carrinho')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-xl text-gray-900 dark:text-white">
            {step === 'details' ? 'Dados do Pedido' : 'Confirmar Pedido'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step === 'details' ? "bg-primary" : "bg-green-500")} />
            <div className={cn("h-1 flex-1 rounded-full transition-all duration-500", step === 'confirmation' ? "bg-primary" : "bg-gray-200 dark:bg-white/10")} />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 mt-4">
        <AnimatePresence mode="wait">
          {step === 'details' ? (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              {/* Delivery Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-black flex items-center gap-2 text-gray-900 dark:text-white"><Truck className="w-5 h-5 text-primary" /> Como prefere receber?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'delivery', label: 'Delivery', icon: Truck },
                    { id: 'pickup', label: 'Retirada', icon: Store },
                    { id: 'on_site', label: 'No Local', icon: MapPin }
                  ].map(method => (
                    <button key={method.id} onClick={() => setDeliveryMethod(method.id as DeliveryMethod)} className={cn("p-4 rounded-2xl border-2 flex flex-row sm:flex-col items-center justify-center gap-3 transition-all relative overflow-hidden", deliveryMethod === method.id ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-200 dark:hover:border-white/20")}>
                      {deliveryMethod === method.id && <div className="absolute top-2 right-2"><CheckCircle2 className="w-4 h-4 text-primary" /></div>}
                      <method.icon className={cn("w-5 h-5 md:w-6 md:h-6", deliveryMethod === method.id ? "text-primary" : "text-gray-500 dark:text-gray-400")} />
                      <span className={cn("text-xs md:text-sm font-black", deliveryMethod === method.id ? "text-primary" : "text-gray-700 dark:text-gray-200")}>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-black flex items-center gap-2 text-gray-900 dark:text-white"><User className="w-5 h-5 text-primary" /> Seus Dados</h3>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-white/5 p-4 rounded-2xl premium-shadow flex items-center gap-3 border border-gray-100 dark:border-white/10 focus-within:border-primary transition-all">
                    <User className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    <input type="text" placeholder="Seu nome completo" value={customerName} onChange={e => setCustomerName(e.target.value)} className="flex-1 outline-none bg-transparent font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
                  </div>
                  <div className="bg-white dark:bg-white/5 p-4 rounded-2xl premium-shadow flex items-center gap-3 border border-gray-100 dark:border-white/10 focus-within:border-primary transition-all">
                    <Phone className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    <input type="tel" placeholder="Seu WhatsApp (DDD)" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="flex-1 outline-none bg-transparent font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Address */}
              {deliveryMethod === 'delivery' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black flex items-center gap-2 text-gray-900 dark:text-white"><MapPinned className="w-5 h-5 text-primary" /> Endereço de Entrega</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="col-span-3 bg-white dark:bg-white/5 p-4 rounded-2xl premium-shadow border border-gray-100 dark:border-white/10 focus-within:border-primary transition-all">
                        <input type="text" placeholder="Rua / Avenida" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className="w-full outline-none bg-transparent font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
                      </div>
                      <div className="bg-white dark:bg-white/5 p-4 rounded-2xl premium-shadow border border-gray-100 dark:border-white/10 focus-within:border-primary transition-all">
                        <input type="text" placeholder="Nº" value={address.number} onChange={e => setAddress({ ...address, number: e.target.value })} className="w-full outline-none bg-transparent font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl premium-shadow border border-gray-100 dark:border-white/10 focus-within:border-primary transition-all flex items-center justify-between">
                      <select 
                        value={address.neighborhoodId} 
                        onChange={e => setAddress({ ...address, neighborhoodId: e.target.value })}
                        className="w-full outline-none font-black text-gray-900 dark:text-white appearance-none bg-transparent cursor-pointer"
                      >
                        <option value="" disabled className="dark:bg-[#0f0f11]">Selecione seu bairro</option>
                        {neighborhoods.map(n => (
                          <option key={n.id} value={n.id} className="dark:bg-[#0f0f11]">{n.name} ({formatCurrency(n.deliveryFee)})</option>
                        ))}
                      </select>
                      <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-600 pointer-events-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white dark:bg-white/5 p-4 rounded-2xl premium-shadow border border-gray-100 dark:border-white/10 focus-within:border-primary transition-all">
                        <input type="text" placeholder="Complemento" value={address.complement} onChange={e => setAddress({ ...address, complement: e.target.value })} className="w-full outline-none bg-transparent font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
                      </div>
                      <div className="bg-white dark:bg-white/5 p-4 rounded-2xl premium-shadow border border-gray-100 dark:border-white/10 focus-within:border-primary transition-all">
                        <input type="text" placeholder="Ponto de Referência" value={address.reference} onChange={e => setAddress({ ...address, reference: e.target.value })} className="w-full outline-none bg-transparent font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-black flex items-center gap-2 text-gray-900 dark:text-white"><CreditCard className="w-5 h-5 text-primary" /> Forma de Pagamento</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'pix', label: 'PIX' },
                    { id: 'card_credit', label: 'Cartão Crédito' },
                    { id: 'card_debit', label: 'Cartão Débito' },
                    { id: 'money', label: 'Dinheiro' }
                  ].map(m => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id as PaymentMethod)} className={cn("p-4 rounded-2xl border-2 flex items-center gap-3 transition-all", paymentMethod === m.id ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-200 dark:hover:border-white/20")}>
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center", paymentMethod === m.id ? "border-primary" : "border-gray-300 dark:border-gray-600")}>
                        {paymentMethod === m.id && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                      <span className={cn("text-sm font-black", paymentMethod === m.id ? "text-primary" : "text-gray-700 dark:text-gray-200")}>{m.label}</span>
                    </button>
                  ))}
                </div>
                {paymentMethod === 'money' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-white/5 p-4 rounded-2xl premium-shadow mt-3 border border-gray-100 dark:border-white/10 focus-within:border-primary transition-all">
                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Troco para quanto?</p>
                    <input type="number" placeholder="Ex: 50" value={changeFor} onChange={e => setChangeFor(e.target.value)} className="w-full outline-none bg-transparent font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600" />
                  </motion.div>
                )}
              </div>

              {/* Order Observations */}
              <div className="space-y-4">
                <h3 className="text-lg font-black flex items-center gap-2 text-gray-900 dark:text-white"><MessageSquare className="w-5 h-5 text-primary" /> Observações Finais</h3>
                <div className="bg-white dark:bg-white/5 p-4 rounded-2xl premium-shadow border border-gray-100 dark:border-white/10 focus-within:border-primary transition-all">
                  <textarea 
                    placeholder="Alguma observação final para o seu pedido?" 
                    value={orderObservations} 
                    onChange={e => setOrderObservations(e.target.value)} 
                    rows={2}
                    className="w-full outline-none bg-transparent font-black text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none"
                  />
                </div>
              </div>

              <Button onClick={() => validateCheckout() && setStep('confirmation')} className="w-full py-6 text-lg rounded-3xl shadow-xl shadow-primary/20 font-black">
                Revisar Pedido
              </Button>
            </motion.div>
          ) : (
            <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
              <div className="bg-white dark:bg-white/5 rounded-[2.5rem] premium-shadow overflow-hidden border border-gray-100 dark:border-white/10">
                <div className="bg-primary p-6 text-white text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-90" />
                  <h3 className="text-xl font-black">Resumo do Pedido</h3>
                  <p className="text-white/70 text-xs font-black uppercase tracking-widest">Confira tudo antes de enviar</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Items Summary */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-white/10 pb-2">Itens Escolhidos</p>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-black text-gray-900 dark:text-white leading-tight">{item.quantity}x {item.name}</p>
                          {item.variation && <p className="text-[10px] font-black text-primary dark:text-primary-light uppercase">{item.variation.name}</p>}
                          {item.addons.length > 0 && (
                            <p className="text-[10px] text-gray-600 dark:text-gray-300 font-bold">
                              {item.addons.map(g => g.items.map(i => i.name).join(', ')).join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="font-black text-gray-900 dark:text-white text-sm">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Payment Summary */}
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-white/10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Entrega</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        {deliveryMethod === 'delivery' ? 'Delivery' : deliveryMethod === 'pickup' ? 'Retirada' : 'No Local'}
                      </p>
                      {deliveryMethod === 'delivery' && (
                        <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-tight font-bold">
                          {address.street}, {address.number}<br/>
                          {selectedNeighborhood?.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Pagamento</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white capitalize">
                        {paymentMethod.replace('_', ' ')}
                      </p>
                      {paymentMethod === 'money' && changeFor && (
                        <p className="text-[11px] text-gray-600 dark:text-gray-300 font-bold">Troco para {formatCurrency(Number(changeFor))}</p>
                      )}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="pt-6 border-t border-gray-100 dark:border-white/10 space-y-2">
                    <div className="flex justify-between text-gray-700 dark:text-gray-200 font-black text-sm">
                      <span>Subtotal</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-200 font-black text-sm">
                      <span>Taxa de Entrega</span>
                      <span className="text-green-500">{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Grátis'}</span>
                    </div>
                    <div className="pt-4 flex justify-between items-center">
                      <span className="text-lg font-black text-gray-900 dark:text-white">Total Final</span>
                      <span className="text-3xl font-black text-primary dark:text-primary-light">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button onClick={handleFinishOrder} className="w-full py-6 text-lg rounded-3xl bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/30 font-black">
                  <Send className="w-6 h-6 mr-2" />
                  Confirmar e Enviar no WhatsApp
                </Button>
                <button 
                  onClick={() => setStep('details')}
                  className="w-full py-4 text-gray-500 dark:text-gray-400 font-black text-sm uppercase tracking-widest hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Alterar Dados
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
