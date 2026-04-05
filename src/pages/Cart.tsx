import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Trash2, Plus, Minus, Ticket, Truck, Store, User, Phone, MapPinned, CreditCard, Send, MapPin, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/Button';
import { storeConfig } from '../mockData';
import { toast } from 'sonner';
import { DeliveryMethod, PaymentMethod } from '../types';
import { cn } from '../lib/utils';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState({ street: '', number: '', neighborhood: '', complement: '', reference: '' });
  const [changeFor, setChangeFor] = useState('');

  const deliveryFee = deliveryMethod === 'delivery' ? 5.00 : 0;
  const total = cartTotal + deliveryFee;

  const handleFinishOrder = () => {
    if (!customerName || !customerPhone) {
      toast.error('Preencha seu nome e telefone');
      return;
    }
    if (deliveryMethod === 'delivery' && (!address.street || !address.number || !address.neighborhood)) {
      toast.error('Preencha os dados de entrega');
      return;
    }

    const itemsText = cart.map(item => {
      let text = `*${item.quantity}x ${item.name}*`;
      if (item.variation) text += ` (${item.variation.name})`;
      if (item.addons.length > 0) {
        item.addons.forEach(group => {
          text += `\n  - ${group.groupName}: ${group.items.map(i => i.name).join(', ')}`;
        });
      }
      if (item.observations) text += `\n  _Obs: ${item.observations}_`;
      text += `\n  Subtotal: ${formatCurrency(item.totalPrice)}`;
      return text;
    }).join('\n\n');

    const deliveryText = deliveryMethod === 'delivery' 
      ? `*Endereço de Entrega:* \n${address.street}, ${address.number} - ${address.neighborhood}\n${address.complement ? `Comp: ${address.complement}\n` : ''}${address.reference ? `Ref: ${address.reference}` : ''}`
      : `*Método:* ${deliveryMethod === 'pickup' ? 'Retirada na Loja' : 'Consumir no Local'}`;

    const paymentText = `*Forma de Pagamento:* ${paymentMethod.toUpperCase()}${changeFor ? ` (Troco para ${formatCurrency(Number(changeFor))})` : ''}`;

    const message = encodeURIComponent(
      `*NOVO PEDIDO - AÇAÍ EXPRESS PRO*\n` +
      `--------------------------------\n` +
      `*Cliente:* ${customerName}\n` +
      `*Telefone:* ${customerPhone}\n` +
      `--------------------------------\n` +
      `${itemsText}\n` +
      `--------------------------------\n` +
      `*Subtotal:* ${formatCurrency(cartTotal)}\n` +
      `*Taxa de Entrega:* ${formatCurrency(deliveryFee)}\n` +
      `*TOTAL:* ${formatCurrency(total)}\n` +
      `--------------------------------\n` +
      `${deliveryText}\n` +
      `${paymentText}\n` +
      `--------------------------------\n` +
      `_Pedido gerado via Cardápio Digital_`
    );

    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${message}`, '_blank');
    toast.success('Pedido enviado com sucesso!');
    clearCart();
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-16 h-16 text-primary/20" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Que tal adicionar um açaí bem cremoso para começar?</p>
        <Button onClick={() => navigate('/')} className="w-full max-w-xs rounded-2xl">Ver Cardápio</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white sticky top-0 z-40 border-b px-4 py-4 flex items-center gap-4">
        <button onClick={() => step === 'checkout' ? setStep('cart') : navigate('/')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-black text-xl">{step === 'cart' ? 'Meu Carrinho' : 'Finalizar Pedido'}</h1>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {step === 'cart' ? (
          <>
            <div className="space-y-4">
              {cart.map(item => (
                <motion.div layout key={item.id} className="bg-white p-4 rounded-[2rem] premium-shadow flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    {item.variation && <p className="text-xs text-gray-500 mb-1">Tamanho: {item.variation.name}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm"><Minus className="w-4 h-4" /></button>
                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm"><Plus className="w-4 h-4" /></button>
                      </div>
                      <span className="font-black text-primary">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] premium-shadow space-y-4">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-bold">{formatCurrency(cartTotal)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Taxa de Entrega</span><span className="font-bold text-secondary">{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Grátis'}</span></div>
              <div className="pt-4 border-t flex justify-between items-center"><span className="text-lg font-bold">Total</span><span className="text-2xl font-black text-primary">{formatCurrency(total)}</span></div>
            </div>
            <Button onClick={() => setStep('checkout')} className="w-full py-6 text-lg rounded-3xl">Continuar para Checkout</Button>
          </>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Como prefere receber?</h3>
              <div className="grid grid-cols-3 gap-3">
                {[{ id: 'delivery', label: 'Delivery', icon: Truck }, { id: 'pickup', label: 'Retirada', icon: Store }, { id: 'on_site', label: 'No Local', icon: MapPin }].map(method => (
                  <button key={method.id} onClick={() => setDeliveryMethod(method.id as DeliveryMethod)} className={cn("p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all", deliveryMethod === method.id ? "border-primary bg-primary/5" : "border-white bg-white")}>
                    <method.icon className={cn("w-6 h-6", deliveryMethod === method.id ? "text-primary" : "text-gray-400")} />
                    <span className={cn("text-xs font-bold", deliveryMethod === method.id ? "text-primary" : "text-gray-500")}>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Seus Dados</h3>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-2xl premium-shadow flex items-center gap-3"><User className="w-5 h-5 text-gray-300" /><input type="text" placeholder="Seu nome completo" value={customerName} onChange={e => setCustomerName(e.target.value)} className="flex-1 outline-none font-medium" /></div>
                <div className="bg-white p-4 rounded-2xl premium-shadow flex items-center gap-3"><Phone className="w-5 h-5 text-gray-300" /><input type="tel" placeholder="Seu WhatsApp (DDD)" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="flex-1 outline-none font-medium" /></div>
              </div>
            </div>
            {deliveryMethod === 'delivery' && (
              <div className="space-y-4">
                <h3 className="text-lg font-black flex items-center gap-2"><MapPinned className="w-5 h-5 text-primary" /> Endereço de Entrega</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3 bg-white p-4 rounded-2xl premium-shadow"><input type="text" placeholder="Rua / Avenida" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className="w-full outline-none font-medium" /></div>
                  <div className="bg-white p-4 rounded-2xl premium-shadow"><input type="text" placeholder="Nº" value={address.number} onChange={e => setAddress({ ...address, number: e.target.value })} className="w-full outline-none font-medium" /></div>
                  <div className="col-span-2 bg-white p-4 rounded-2xl premium-shadow"><input type="text" placeholder="Bairro" value={address.neighborhood} onChange={e => setAddress({ ...address, neighborhood: e.target.value })} className="w-full outline-none font-medium" /></div>
                  <div className="col-span-2 bg-white p-4 rounded-2xl premium-shadow"><input type="text" placeholder="Complemento" value={address.complement} onChange={e => setAddress({ ...address, complement: e.target.value })} className="w-full outline-none font-medium" /></div>
                </div>
              </div>
            )}
            <div className="space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Forma de Pagamento</h3>
              <div className="grid grid-cols-2 gap-3">
                {['pix', 'card_credit', 'card_debit', 'money'].map(m => (
                  <button key={m} onClick={() => setPaymentMethod(m as PaymentMethod)} className={cn("p-4 rounded-2xl border-2 flex items-center gap-3 transition-all", paymentMethod === m ? "border-primary bg-primary/5" : "border-white bg-white")}>
                    <div className={cn("w-2 h-2 rounded-full", paymentMethod === m ? "bg-primary" : "bg-gray-200")} />
                    <span className={cn("text-sm font-bold capitalize", paymentMethod === m ? "text-primary" : "text-gray-500")}>{m.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleFinishOrder} className="w-full py-6 text-lg rounded-3xl bg-secondary hover:bg-secondary/90"><Send className="w-6 h-6 mr-2" /> Enviar Pedido no WhatsApp</Button>
          </div>
        )}
      </div>
    </div>
  );
};
