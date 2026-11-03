import React, { useState } from 'react';
import { useTrading } from '../../context/TradingContext';
import { useAuth } from '../../context/AuthContext';
import { TicketCategory, TicketPriority, SupportTicket } from '../../types';
import {
  LifeBuoy,
  PlusCircle,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { tickets, createTicket, replyTicket, updateTicketStatus } = useTrading();

  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // New ticket form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('trading');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [initialMsg, setInitialMsg] = useState('');

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Tickets visible to current user (if admin, all tickets; if user, user tickets)
  const visibleTickets = currentUser?.role === 'admin'
    ? tickets
    : tickets.filter((t) => t.userId === currentUser?.id);

  const activeTicket = tickets.find((t) => t.id === activeTicketId) || visibleTickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMsg.trim()) return;

    createTicket(subject.trim(), category, priority, initialMsg.trim());
    setSubject('');
    setInitialMsg('');
    setShowNewModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyMessage.trim()) return;
    replyTicket(activeTicket.id, replyMessage.trim());
    setReplyMessage('');
  };

  const faqs = [
    {
      q: 'How does demo trading with virtual funds work?',
      a: 'Every new account starts with $10,000 in virtual funds. You can execute simulated buy/sell orders across cryptocurrencies, forex, stocks, and commodities with real-time price feeds. Simulated profit and loss are calculated instantly without risking real money.',
    },
    {
      q: 'Can I reset my demo virtual balance if I run out of funds?',
      a: 'Yes, anytime! In the Dashboard or Trading Terminal, click the "Reset Funds" button to refresh your virtual balance back to $10,000.00.',
    },
    {
      q: 'Are the candlestick charts based on real market data?',
      a: 'Yes, BINANY TRADING uses high-grade financial candlestick data feeds powered by TradingView Lightweight Charts with realistic spread, volume, and tick modeling.',
    },
    {
      q: 'When will live real-money trading be supported?',
      a: 'Live real-money deposits, withdrawals, and order execution will be enabled upon conclusion of our formal regulatory licensing and compliance audit requirements.',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customer Support Center
          </h1>
          <p className="text-xs text-slate-500">
            Submit inquiry tickets, track resolution status, and access verified trading documentation
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      {/* Main Support Workspace: Tickets List + Conversation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px]">
        {/* Left Column: Tickets Queue (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Your Tickets ({visibleTickets.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">24/7 Desk</span>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[460px] pr-1">
            {visibleTickets.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No tickets open. Click "Open Support Ticket" to contact assistance.
              </div>
            ) : (
              visibleTickets.map((t) => {
                const isSelected = activeTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTicketId(t.id)}
                    className={`flex flex-col p-3 rounded-xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-slate-500">{t.id}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          t.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : t.status === 'in_progress'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-slate-200 truncate">{t.subject}</span>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                      <span className="capitalize">{t.category}</span>
                      <span>{new Date(t.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation Thread (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm flex flex-col h-[520px]">
          {activeTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-100">{activeTicket.subject}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {activeTicket.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Priority: <strong className="text-amber-400 uppercase">{activeTicket.priority}</strong></span>
                    <span>·</span>
                    <span>Category: <strong className="text-slate-300 capitalize">{activeTicket.category}</strong></span>
                    <span>·</span>
                    <span>Opened by: <strong className="text-slate-300">{activeTicket.userName}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeTicket.status !== 'resolved' ? (
                    <button
                      onClick={() => updateTicketStatus(activeTicket.id, 'resolved')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Resolved
                    </span>
                  )}
                </div>
              </div>

              {/* Messages scroll area */}
              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 pr-2">
                {activeTicket.messages.map((m) => {
                  const isUserSender = m.senderId === currentUser?.id;
                  const isAdminRole = m.senderRole === 'admin';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col max-w-[80%] rounded-xl p-3 text-xs ${
                        isUserSender
                          ? 'ml-auto bg-blue-600 text-white rounded-tr-xs'
                          : 'mr-auto bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] mb-1 opacity-80">
                        <span className="font-bold flex items-center gap-1">
                          {m.senderName}
                          {isAdminRole && (
                            <span className="bg-amber-400/20 text-amber-300 px-1 rounded text-[9px] uppercase font-mono">
                              Staff
                            </span>
                          )}
                        </span>
                        <span className="font-mono">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Bar */}
              <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={
                    activeTicket.status === 'resolved'
                      ? 'Ticket is marked as resolved. Enter a message to re-open.'
                      : 'Type your message or follow-up question...'
                  }
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
              <LifeBuoy className="w-10 h-10 text-slate-600 mb-2" />
              <span>Select a support ticket on the left to view the thread.</span>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="p-6 rounded-2xl bg-slate-900/60 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex items-center justify-between w-full p-4 text-left font-semibold text-xs text-slate-200 hover:bg-slate-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Create Support Ticket</h3>
            <p className="text-xs text-slate-400 mb-4">
              Our financial engineering and technical desk typically responds within a few minutes.
            </p>

            <form onSubmit={handleCreateTicket} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Subject / Inquiry Title</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Question regarding margin requirements on BTC"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="trading">Trading Execution</option>
                    <option value="account">Account & Profile</option>
                    <option value="deposit_withdrawal">Deposit / Payout (Demo)</option>
                    <option value="technical">Technical / Charting</option>
                    <option value="general">General Inquiries</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Detailed Message</label>
                <textarea
                  required
                  rows={4}
                  value={initialMsg}
                  onChange={(e) => setInitialMsg(e.target.value)}
                  placeholder="Describe your inquiry or the behavior you experienced..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
