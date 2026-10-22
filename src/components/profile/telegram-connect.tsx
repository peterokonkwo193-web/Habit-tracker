"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Copy, Check, Link2Off, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateTelegramCode, disconnectTelegram } from "@/lib/actions/profile";

interface TelegramConnectProps {
  telegram: {
    chat_id?: string;
    username?: string | null;
    verification_code?: string | null;
    verified_at?: string | null;
  } | null;
  userId: string;
}

export function TelegramConnect({ telegram }: TelegramConnectProps) {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isConnected = telegram?.verified_at != null;

  const handleGenerateCode = () => {
    startTransition(async () => {
      const result = await generateTelegramCode();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setCode(result.code ?? null);
    });
  };

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Code copied!");
  };

  const handleDisconnect = () => {
    if (!confirm("Disconnect Telegram? You'll stop receiving reminders.")) return;
    startTransition(async () => {
      const result = await disconnectTelegram();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Telegram disconnected");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[rgb(37,99,235)]" />
          Telegram Integration
          {isConnected && (
            <span className="flex items-center gap-1 text-xs font-normal text-[rgb(16,185,129)] ml-auto">
              <CheckCircle className="h-3.5 w-3.5" /> Connected
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
              <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-[rgb(16,185,129)]" />
              </div>
              <div>
                <p className="font-medium text-[rgb(15,23,42)] dark:text-white">Telegram connected</p>
                {telegram?.username && (
                  <p className="text-sm text-[rgb(100,116,139)]">@{telegram.username}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-[rgb(100,116,139)]">
              You'll receive morning reminders and evening summaries via Telegram.
              Reply with habit numbers to mark them complete.
            </p>
            <Button variant="outline" onClick={handleDisconnect} loading={isPending} className="text-[rgb(239,68,68)] hover:text-[rgb(239,68,68)] hover:border-[rgb(239,68,68)]">
              <Link2Off className="h-4 w-4" />
              Disconnect Telegram
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[rgb(100,116,139)]">
              Connect your Telegram account to receive daily reminders and mark habits complete
              directly from Telegram.
            </p>

            <AnimatePresence>
              {code ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-[rgba(37,99,235,0.05)] border border-[rgba(37,99,235,0.2)] space-y-3">
                    <p className="text-sm font-medium text-[rgb(15,23,42)] dark:text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[rgb(245,158,11)]" />
                      Code expires in 10 minutes
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 p-3 bg-[rgb(241,245,249)] dark:bg-[rgb(30,41,59)] rounded-xl font-mono text-2xl font-bold text-center text-[rgb(37,99,235)] tracking-[0.2em]">
                        {code}
                      </div>
                      <Button size="icon" variant="outline" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-[rgb(16,185,129)]" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <ol className="space-y-2 text-sm text-[rgb(100,116,139)]">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[rgb(37,99,235)] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <span>
                        Open{" "}
                        <a
                          href="https://t.me/HabitFlowApp_bot"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[rgb(37,99,235)] underline underline-offset-2"
                        >
                          @HabitFlowApp_bot
                        </a>{" "}
                        on Telegram
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[rgb(37,99,235)] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <span>Send <strong className="text-[rgb(15,23,42)] dark:text-white">/start</strong> to the bot</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[rgb(37,99,235)] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <span>Send your code: <strong className="text-[rgb(37,99,235)] font-mono">{code}</strong></span>
                    </li>
                  </ol>
                </motion.div>
              ) : (
                <Button onClick={handleGenerateCode} loading={isPending}>
                  <MessageCircle className="h-4 w-4" />
                  Connect Telegram
                </Button>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
