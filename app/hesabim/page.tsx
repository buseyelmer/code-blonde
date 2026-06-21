"use client";

import { useProfile } from "@raxonltd/raxon-core/hook";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Check,
  X,
  Loader2,
  Heart,
  MapPin,
  ShoppingBag,
  Shield,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRaxon } from "@raxonltd/raxon-core";
import {
  AccountButtonPrimary,
  AccountButtonSecondary,
  AccountCard,
  AccountInfoRow,
  AccountModal,
  AccountPageHeader,
  AccountQuickLink,
  accountInputClass,
  accountLabelClass,
} from "@/core/component/account/account.ui";

interface ExtendedProfile {
  phoneNumberVerified?: boolean;
  emailVerified?: boolean;
  [key: string]: unknown;
}

export default function ProfilPage() {
  const { profile } = useRaxon();
  const { update, verifyPhoneNumber, verifyEmail } = useProfile();
  const updateMutation = update();
  const verifyPhoneMutation = verifyPhoneNumber();
  const verifyEmailMutation = verifyEmail();

  const [isEditing, setIsEditing] = useState(false);
  const [phoneVerification, setPhoneVerification] = useState({
    isOpen: false,
    code: "",
    step: "send" as "send" | "verify",
  });
  const [emailVerification, setEmailVerification] = useState({
    isOpen: false,
    code: "",
    step: "send" as "send" | "verify",
  });

  const form = useForm({
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phoneNumber: profile?.phoneNumber || "",
    },
  });

  const handleSubmit = (data: { firstName: string; lastName: string; phoneNumber: string }) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Profil bilgileriniz güncellendi");
        setIsEditing(false);
      },
      onError: () => {
        toast.error("Güncelleme başarısız");
      },
    });
  };

  const handleSendPhoneCode = () => {
    if (!profile?.phoneNumber) {
      toast.error("Önce telefon numarası ekleyin");
      return;
    }
    verifyPhoneMutation.mutate(
      { phoneNumber: profile.phoneNumber },
      {
        onSuccess: () => {
          toast.success("Doğrulama kodu gönderildi");
          setPhoneVerification((prev) => ({ ...prev, step: "verify" }));
        },
        onError: () => toast.error("Kod gönderilemedi"),
      },
    );
  };

  const handleVerifyPhone = () => {
    if (!profile?.phoneNumber || !phoneVerification.code) return;
    verifyPhoneMutation.mutate(
      { phoneNumber: profile.phoneNumber, code: phoneVerification.code },
      {
        onSuccess: () => {
          toast.success("Telefon numarası doğrulandı");
          setPhoneVerification({ isOpen: false, code: "", step: "send" });
        },
        onError: () => toast.error("Doğrulama başarısız"),
      },
    );
  };

  const handleSendEmailCode = () => {
    if (!profile?.email) {
      toast.error("E-posta adresi bulunamadı");
      return;
    }
    verifyEmailMutation.mutate(
      { email: profile.email },
      {
        onSuccess: () => {
          toast.success("Doğrulama kodu gönderildi");
          setEmailVerification((prev) => ({ ...prev, step: "verify" }));
        },
        onError: () => toast.error("Kod gönderilemedi"),
      },
    );
  };

  const handleVerifyEmail = () => {
    if (!profile?.email || !emailVerification.code) return;
    verifyEmailMutation.mutate(
      { email: profile.email, code: emailVerification.code },
      {
        onSuccess: () => {
          toast.success("E-posta adresi doğrulandı");
          setEmailVerification({ isOpen: false, code: "", step: "send" });
        },
        onError: () => toast.error("Doğrulama başarısız"),
      },
    );
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const extendedProfile = profile as ExtendedProfile | null;
  const isPhoneVerified = extendedProfile?.phoneNumberVerified;
  const isEmailVerified = extendedProfile?.emailVerified;

  return (
    <div className="space-y-8">
      <AccountPageHeader
        title="Hesabım"
        subtitle="Profil bilgilerinizi görüntüleyin ve düzenleyin"
        action={
          !isEditing ? (
            <AccountButtonPrimary onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
              <Edit2 className="h-4 w-4" strokeWidth={1.5} />
              Düzenle
            </AccountButtonPrimary>
          ) : undefined
        }
      />

      <AccountCard title="Kişisel Bilgiler">
        {isEditing ? (
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={accountLabelClass}>Ad</label>
                <input {...form.register("firstName")} className={`mt-2 ${accountInputClass}`} />
              </div>
              <div>
                <label className={accountLabelClass}>Soyad</label>
                <input {...form.register("lastName")} className={`mt-2 ${accountInputClass}`} />
              </div>
            </div>
            <div>
              <label className={accountLabelClass}>Telefon</label>
              <input {...form.register("phoneNumber")} className={`mt-2 ${accountInputClass}`} />
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <AccountButtonPrimary type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" strokeWidth={1.5} />
                )}
                Kaydet
              </AccountButtonPrimary>
              <AccountButtonSecondary type="button" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" strokeWidth={1.5} />
                İptal
              </AccountButtonSecondary>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AccountInfoRow
              icon={UserIcon}
              label="Ad Soyad"
              value={`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim()}
            />
            <AccountInfoRow
              icon={Mail}
              label="E-posta"
              value={profile?.email ?? "-"}
              action={
                isEmailVerified ? (
                  <ShieldCheck className="h-5 w-5 text-[#5C4638]" strokeWidth={1.5} />
                ) : (
                  <button
                    type="button"
                    onClick={() => setEmailVerification((prev) => ({ ...prev, isOpen: true }))}
                    className="text-[10px] tracking-[0.18em] uppercase text-[#A17E65] transition hover:text-[#5C4638]"
                  >
                    Doğrula
                  </button>
                )
              }
            />
            <AccountInfoRow
              icon={Phone}
              label="Telefon"
              value={profile?.phoneNumber || "-"}
              action={
                profile?.phoneNumber ? (
                  isPhoneVerified ? (
                    <ShieldCheck className="h-5 w-5 text-[#5C4638]" strokeWidth={1.5} />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPhoneVerification((prev) => ({ ...prev, isOpen: true }))}
                      className="text-[10px] tracking-[0.18em] uppercase text-[#A17E65] transition hover:text-[#5C4638]"
                    >
                      Doğrula
                    </button>
                  )
                ) : undefined
              }
            />
            <AccountInfoRow
              icon={Calendar}
              label="Üyelik Tarihi"
              value={formatDate(profile?.createdAt)}
            />
          </div>
        )}
      </AccountCard>

      <AccountCard title="Hesap Güvenliği">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SecurityStatusCard
            verified={Boolean(isEmailVerified)}
            title="E-posta Doğrulama"
            status={isEmailVerified ? "Doğrulandı" : "Doğrulanmamış"}
            onVerify={() => setEmailVerification((prev) => ({ ...prev, isOpen: true }))}
          />
          <SecurityStatusCard
            verified={Boolean(isPhoneVerified)}
            title="Telefon Doğrulama"
            status={
              isPhoneVerified
                ? "Doğrulandı"
                : profile?.phoneNumber
                  ? "Doğrulanmamış"
                  : "Telefon eklenmemiş"
            }
            onVerify={
              profile?.phoneNumber && !isPhoneVerified
                ? () => setPhoneVerification((prev) => ({ ...prev, isOpen: true }))
                : undefined
            }
          />
        </div>
      </AccountCard>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <AccountQuickLink
          title="Siparişlerim"
          description="Siparişlerinizi takip edin"
          href="/hesabim/siparislerim"
          icon={ShoppingBag}
        />
        <AccountQuickLink
          title="Favorilerim"
          description="Favori ürünlerinizi görün"
          href="/hesabim/favorilerim"
          icon={Heart}
        />
        <AccountQuickLink
          title="Adreslerim"
          description="Teslimat adreslerinizi yönetin"
          href="/hesabim/adreslerim"
          icon={MapPin}
        />
      </div>

      {phoneVerification.isOpen && (
        <AccountModal
          title="Telefon Doğrulama"
          subtitle={profile?.phoneNumber ?? undefined}
          onClose={() => setPhoneVerification({ isOpen: false, code: "", step: "send" })}
        >
          {phoneVerification.step === "send" ? (
            <>
              <p className="mb-6 text-sm text-[#8B6B57]">
                Telefon numaranıza doğrulama kodu göndereceğiz.
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <AccountButtonSecondary
                  onClick={() => setPhoneVerification({ isOpen: false, code: "", step: "send" })}
                >
                  İptal
                </AccountButtonSecondary>
                <AccountButtonPrimary onClick={handleSendPhoneCode} disabled={verifyPhoneMutation.isPending}>
                  {verifyPhoneMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Kod Gönder
                </AccountButtonPrimary>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-[#8B6B57]">Telefonunuza gönderilen kodu girin.</p>
              <label className={accountLabelClass}>Doğrulama Kodu</label>
              <input
                type="text"
                maxLength={6}
                value={phoneVerification.code}
                onChange={(e) =>
                  setPhoneVerification((prev) => ({
                    ...prev,
                    code: e.target.value.replace(/\D/g, ""),
                  }))
                }
                className={`mt-2 ${accountInputClass} text-center text-lg tracking-[0.35em]`}
                placeholder="000000"
              />
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <AccountButtonSecondary
                  onClick={() => setPhoneVerification((prev) => ({ ...prev, step: "send" }))}
                >
                  Geri
                </AccountButtonSecondary>
                <AccountButtonPrimary
                  onClick={handleVerifyPhone}
                  disabled={verifyPhoneMutation.isPending || phoneVerification.code.length < 4}
                >
                  {verifyPhoneMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Doğrula
                </AccountButtonPrimary>
              </div>
            </>
          )}
        </AccountModal>
      )}

      {emailVerification.isOpen && (
        <AccountModal
          title="E-posta Doğrulama"
          subtitle={profile?.phoneNumber ?? undefined}          onClose={() => setEmailVerification({ isOpen: false, code: "", step: "send" })}
        >
          {emailVerification.step === "send" ? (
            <>
              <p className="mb-6 text-sm text-[#8B6B57]">
                E-posta adresinize doğrulama kodu göndereceğiz.
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <AccountButtonSecondary
                  onClick={() => setEmailVerification({ isOpen: false, code: "", step: "send" })}
                >
                  İptal
                </AccountButtonSecondary>
                <AccountButtonPrimary onClick={handleSendEmailCode} disabled={verifyEmailMutation.isPending}>
                  {verifyEmailMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Kod Gönder
                </AccountButtonPrimary>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-[#8B6B57]">E-postanıza gönderilen kodu girin.</p>
              <label className={accountLabelClass}>Doğrulama Kodu</label>
              <input
                type="text"
                maxLength={6}
                value={emailVerification.code}
                onChange={(e) =>
                  setEmailVerification((prev) => ({
                    ...prev,
                    code: e.target.value.replace(/\D/g, ""),
                  }))
                }
                className={`mt-2 ${accountInputClass} text-center text-lg tracking-[0.35em]`}
                placeholder="000000"
              />
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <AccountButtonSecondary
                  onClick={() => setEmailVerification((prev) => ({ ...prev, step: "send" }))}
                >
                  Geri
                </AccountButtonSecondary>
                <AccountButtonPrimary
                  onClick={handleVerifyEmail}
                  disabled={verifyEmailMutation.isPending || emailVerification.code.length < 4}
                >
                  {verifyEmailMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Doğrula
                </AccountButtonPrimary>
              </div>
            </>
          )}
        </AccountModal>
      )}
    </div>
  );
}

function SecurityStatusCard({
  verified,
  title,
  status,
  onVerify,
}: {
  verified: boolean;
  title: string;
  status: string;
  onVerify?: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-sm border border-[#D9C5B0]/40 bg-[#F8F1E9]/60 p-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
          verified ? "border-[#5C4638]/20 bg-[#EDE0D1]/50" : "border-[#D9C5B0]/60 bg-[#FDFAF6]"
        }`}
      >
        {verified ? (
          <ShieldCheck className="h-4 w-4 text-[#5C4638]" strokeWidth={1.5} />
        ) : (
          <Shield className="h-4 w-4 text-[#A17E65]" strokeWidth={1.5} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[#5C4638]">{title}</p>
        <p className="text-xs text-[#8B6B57]">{status}</p>
      </div>
      {onVerify && (
        <button
          type="button"
          onClick={onVerify}
          className="shrink-0 rounded-full border border-[#5C4638] px-3 py-1.5 text-[10px] tracking-[0.16em] uppercase text-[#5C4638] transition hover:bg-[#5C4638] hover:text-[#F8F1E9]"
        >
          Doğrula
        </button>
      )}
    </div>
  );
}
