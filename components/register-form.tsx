"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { LoadingButton } from "./loading-button";
import { TermsModal } from "./terms-modal";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { COUNTRIES_WITH_DDI, getDDIByCountry } from "@/lib/country-data";

export function RegisterForm() {
  const router = useRouter();
  const { register, loading, error } = useAuth();

  const [cities, setCities] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<
    { country: string; cities: string[] }[]
  >([]);
  const [formError, setFormError] = useState("");
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    gender: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    ddi: "",
  });

  const [showPassword, setSwowPasword] = useState(false);
  const [showConfirmPassword, setShowComfirmPassword] = useState(false);

  function togglePassword() {
    setSwowPasword((prev) => !prev);
  }

  function toggleConfimPassword() {
    setShowComfirmPassword((prev) => !prev);
  }

  /* =====================
     Input handler
  ===================== */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =====================
     Fetch cities data
  ===================== */
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries",
        );
        const data = await res.json();
        setAllCities(data.data);
      } catch (err) {
        console.error("Erro ao carregar cidades", err);
      }
    };

    fetchCities();
  }, []);

  /* =====================
     Filter cities by country & auto-fill DDI
  ===================== */
  useEffect(() => {
    if (!formData.country) {
      setCities([]);
      setFormData((prev) => ({ ...prev, ddi: "" }));
      return;
    }

    // Get cities for selected country
    const selectedCountry = allCities.find(
      (c) => c.country === formData.country,
    );
    setCities(selectedCountry?.cities || []);

    // Auto-fill DDI
    const ddi = getDDIByCountry(formData.country);
    setFormData((prev) => ({ ...prev, ddi }));
  }, [formData.country, allCities]);

  /* =====================
     Handle Terms Acceptance
  ===================== */
  const handleTermsAccept = () => {
    setFormData((prev) => ({ ...prev, termsAccepted: true }));
  };

  /* =====================
     Submit
  ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const {
      name,
      email,
      phone,
      country,
      city,
      gender,
      password,
      confirmPassword,
      termsAccepted,
      ddi,
    } = formData;

    // Validação básica
    if (
      !name ||
      !email ||
      !phone ||
      !country ||
      !city ||
      !password ||
      !confirmPassword
    ) {
      setFormError("Por favor, preencha todos os campos");
      return;
    }

    if (!termsAccepted) {
      setFormError("Você deve aceitar os Termos e Condições para continuar");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("As senhas não correspondem");
      return;
    }

    if (password.length < 8) {
      setFormError("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    try {
      // Concatenate DDI + phone
      const fullPhone = ddi + phone;

      // Call register with all required fields
      await register(
        name,
        email,
        fullPhone,
        country,
        city,
        gender || "other",
        termsAccepted,
        password,
      );

      // Redirect to activation
      router.push(`/activate/${email}`);
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>
            Comece a gerenciar seus bots WhatsApp
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(formError || error) && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {formError || error}
              </div>
            )}

            <Input
              name="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
            />

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />

            {/* País */}
            <Select
              value={formData.country}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, country: value, city: "" }))
              }
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o país" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES_WITH_DDI.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Cidade */}
            <Select
              value={formData.city}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, city: value }))
              }
              disabled={!formData.country || loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a cidade" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gênero */}
            <Select
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Gênero (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>

            {/* Telefone com DDI */}
            <div className="relative">
              {formData.ddi && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  {formData.ddi}
                </span>
              )}
              <Input
                name="phone"
                placeholder={formData.ddi ? "900000000" : "Telefone"}
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
                className={formData.ddi ? "pl-16" : ""}
              />
            </div>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={togglePassword}
                aria-label={showPassword ? "ocultar senha" : "mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500  cursor-pointer  border-none p-0 bg-transparent"
              >
                {showPassword ? <EyeOff className="w-5 h-5 " /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleConfimPassword}
                aria-label={showConfirmPassword ? "ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500  cursor-pointer border-none p-0 bg-transparent"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    termsAccepted: checked as boolean,
                  }))
                }
                disabled={loading}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Eu aceito os{" "}
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(true)}
                  className="text-accent hover:underline font-medium"
                >
                  Termos e Condições
                </button>
              </label>
            </div>

            <LoadingButton
              loading={loading}
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 cursor-pointer"
            >
              <LogIn />
              {loading ? "Criando conta..." : "Criar Conta"}
            </LoadingButton>

            <div className="text-center text-sm">
              Já tem conta?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Faça login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Terms Modal */}
      <TermsModal
        open={termsModalOpen}
        onOpenChange={setTermsModalOpen}
        onAccept={handleTermsAccept}
      />
    </>
  );
}

