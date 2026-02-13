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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LoadingButton } from "./loading-button";
import { TermsModal } from "./terms-modal";
import { LogIn } from "lucide-react";
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
     Handle Google Sign-Up (UI only for now)
  ===================== */
  const handleGoogleSignUp = () => {
    alert("Registro com Google em desenvolvimento. Em breve disponível!");
  };

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
          {/* Google Sign-Up Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-4 border-2"
            onClick={handleGoogleSignUp}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Registrar com Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com email
              </span>
            </div>
          </div>

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

            <Input
              name="password"
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
            />

            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
            />

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
