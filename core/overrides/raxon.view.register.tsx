"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "@raxonltd/raxon-core/hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const turkishPhoneRegex = /^(\+90[5-9][0-9]{9}|0[5-9][0-9]{9}|[5-9][0-9]{8})$/;

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Ad alanı zorunludur")
      .min(2, "Ad en az 2 karakter olmalıdır")
      .max(50, "Ad en fazla 50 karakter olabilir")
      .regex(/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/, "Ad sadece harf içerebilir"),
    lastName: z
      .string()
      .min(1, "Soyad alanı zorunludur")
      .min(2, "Soyad en az 2 karakter olmalıdır")
      .max(50, "Soyad en fazla 50 karakter olabilir")
      .regex(/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/, "Soyad sadece harf içerebilir"),
    email: z
      .string()
      .min(1, "E-posta alanı zorunludur")
      .email("Geçerli bir e-posta adresi giriniz")
      .max(100, "E-posta adresi çok uzun"),
    phone: z
      .string()
      .min(1, "Telefon numarası zorunludur")
      .regex(turkishPhoneRegex, "Geçerli bir Türk telefon numarası giriniz (örn: +905551234567)")
      .transform((val) => val.replace(/\s/g, "")),
    password: z
      .string()
      .min(1, "Şifre alanı zorunludur")
      .min(6, "Şifre en az 6 karakter olmalıdır")
      .max(100, "Şifre çok uzun"),
    confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
    acceptTerms: z.boolean().refine((val) => val === true, "Kullanım şartlarını kabul etmelisiniz"),
    acceptMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type ViewRegisterProps = {
  onClose?: () => void;
  onSwitchToLogin?: () => void;
};

/**
 * Checkout-friendly register: after success, auto-login so the user continues
 * without switching to the login tab.
 */
export default function ViewRegister({ onClose, onSwitchToLogin }: ViewRegisterProps) {
  const { register: authRegister, loginEmail } = useAuth();
  const registerMutation = authRegister();
  const loginMutation = loginEmail();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      acceptMarketing: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsContinuing(true);

    registerMutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        acceptMarketing: data.acceptMarketing || false,
      },
      {
        onSuccess: () => {
          loginMutation.mutate(
            { email: data.email, password: data.password },
            {
              onSuccess: () => {
                toast.success("Kayıt tamamlandı, devam edebilirsiniz");
                onClose?.();
                setIsContinuing(false);
              },
              onError: () => {
                setIsContinuing(false);
                toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
                onSwitchToLogin?.();
              },
            },
          );
        },
        onError: (error: unknown) => {
          setIsContinuing(false);
          const err = error as { response?: { data?: { info?: { title?: string } } } };
          toast.error(err?.response?.data?.info?.title || "Kayıt başarısız");
        },
      },
    );
  };

  const busy = isSubmitting || registerMutation.isPending || loginMutation.isPending || isContinuing;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              {...register("firstName")}
              placeholder="Adınız"
              className={`w-full rounded-sm border py-3 pl-10 pr-4 text-sm transition-colors focus:outline-none ${
                errors.firstName ? "border-red-500" : "border-gray-200 focus:border-black"
              }`}
            />
          </div>
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div className="relative">
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              {...register("lastName")}
              placeholder="Soyadınız"
              className={`w-full rounded-sm border py-3 pl-10 pr-4 text-sm transition-colors focus:outline-none ${
                errors.lastName ? "border-red-500" : "border-gray-200 focus:border-black"
              }`}
            />
          </div>
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="relative">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="email"
            {...register("email")}
            placeholder="E-posta adresiniz"
            className={`w-full rounded-sm border py-3 pl-10 pr-4 text-sm transition-colors focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-200 focus:border-black"
            }`}
          />
        </div>
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="relative">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type="tel"
            {...register("phone")}
            placeholder="Telefon numaranız (örn: 05551234567)"
            className={`w-full rounded-sm border py-3 pl-10 pr-4 text-sm transition-colors focus:outline-none ${
              errors.phone ? "border-red-500" : "border-gray-200 focus:border-black"
            }`}
          />
        </div>
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      <div className="relative">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Şifreniz (en az 6 karakter)"
            className={`w-full rounded-sm border py-3 pl-10 pr-12 text-sm transition-colors focus:outline-none ${
              errors.password ? "border-red-500" : "border-gray-200 focus:border-black"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="relative">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Şifrenizi tekrar giriniz"
            className={`w-full rounded-sm border py-3 pl-10 pr-12 text-sm transition-colors focus:outline-none ${
              errors.confirmPassword ? "border-red-500" : "border-gray-200 focus:border-black"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start">
          <input
            type="checkbox"
            {...register("acceptTerms")}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-0 focus:ring-offset-0"
          />
          <label className="ml-2 text-sm font-light text-gray-600">
            Kullanım Şartları ve Gizlilik Politikası&apos;nı okudum ve kabul ediyorum. *
          </label>
        </div>
        {errors.acceptTerms && <p className="ml-6 text-xs text-red-500">{errors.acceptTerms.message}</p>}
        <div className="flex items-start">
          <input
            type="checkbox"
            {...register("acceptMarketing")}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-0 focus:ring-offset-0"
          />
          <label className="ml-2 text-sm font-light text-gray-600">
            Kampanya ve promosyon bilgilerini e-posta ile almak istiyorum.
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="group flex w-full items-center justify-center space-x-2 rounded-sm bg-black py-3 text-white transition-colors duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-sm font-light uppercase tracking-wider">
          {busy ? "Hesap oluşturuluyor..." : "Kayıt Ol ve Devam Et"}
        </span>
        {!busy && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
      </button>
    </form>
  );
}
