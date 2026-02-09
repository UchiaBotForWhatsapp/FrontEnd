"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  countries,
  formatPhoneWithDDI,
  isValidPhoneNumber,
} from "@/lib/countries";

export function RegisterForm() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const { toast } = useToast();

  const [allCities, setAllCities] = useState<
    { country: string; cities: string[] }[]
  >([]);
  const [cities, setCities] = useState<string[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    city: "",
    gender: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [selectedCountryDDI, setSelectedCountryDDI] = useState("");

  /* =====================
     Fetch cities
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
     Filter cities by country
  ===================== */
  useEffect(() => {
    if (!formData.country) {
      setCities([]);
      return;
    }

    const selectedCountry = allCities.find(
      (c) => c.country === formData.country,
    );
    setCities(selectedCountry?.cities || []);
  }, [formData.country, allCities]);

  /* =====================
     Update DDI when country changes
  ===================== */
  useEffect(() => {
    if (!formData.country) {
      setSelectedCountryDDI("");
      return;
    }

    const country = countries.find((c) => c.name === formData.country);
    setSelectedCountryDDI(country?.ddi || "");
  }, [formData.country]);

  /* =====================
     Input handler
  ===================== */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For phone number, only allow digits
    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* =====================
     Handle Google Sign Up (UI only)
  ===================== */
  const handleGoogleSignUp = () => {
    toast({
      title: "Em breve",
      description: "Login com Google em breve",
      variant: "default",
    });
  };

  /* =====================
     Handle Terms Accept from Modal
  ===================== */
  const handleAcceptTerms = () => {
    setFormData((prev) => ({ ...prev, termsAccepted: true }));
    setShowTermsModal(false);
  };

  /* =====================
     Submit
  ===================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");

    const {
      name,
      email,
      country,
      city,
      gender,
      phoneNumber,
      password,
      confirmPassword,
      termsAccepted,
    } = formData;

    console.log("Form data:", {
      name,
      email,
      country,
      city,
      gender,
      phoneNumber,
      termsAccepted,
    });

    // Validação básica
    if (
      !name ||
      !email ||
      !country ||
      !city ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      console.log("Validation failed: missing fields");
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      console.log("Validation failed: terms not accepted");
      toast({
        title: "Erro",
        description: "Você deve aceitar os Termos e Condições",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      console.log("Validation failed: password mismatch");
      toast({
        title: "Erro",
        description: "As senhas não correspondem",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      console.log("Validation failed: password too short");
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      console.log("Validation failed: invalid phone number");
      toast({
        title: "Erro",
        description: "Número de telefone inválido. Use apenas números",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Starting registration...");
      // Concatenate DDI + phone number
      const fullPhone = formatPhoneWithDDI(selectedCountryDDI, phoneNumber);
      console.log("Full phone:", fullPhone);

      await register(
        name,
        email,
        password,
        fullPhone,
        gender,
        country,
        city,
        termsAccepted,
      );

      console.log("Registration successful");
      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso. Verifique o seu email.",
        variant: "default",
      });

      // Redirect to activation
      setTimeout(() => {
        router.push(`/activate/${email}`);
      }, 1000);
    } catch (err: any) {
      console.error("Registration error:", err);
      // Handle backend errors
      const errorMessage = err.message || "Erro ao criar conta";

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto px-2 sm:px-0">
        <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-xl sm:text-2xl">Criar Conta</CardTitle>
          <CardDescription className="text-sm">
            Comece a gerenciar seus bots WhatsApp
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Google Sign Up Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-4 text-sm sm:text-base h-10 sm:h-11"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
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

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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

            {/* País com bandeira */}
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
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
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

            {/* Gênero (opcional) */}
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
            <div className="flex gap-1 sm:gap-2">
              <div className="flex items-center gap-1 px-2 sm:px-3 py-2 border rounded-md bg-muted min-w-[80px] sm:min-w-[100px]">
                {formData.country && (
                  <>
                    <span className="text-base sm:text-lg">
                      {countries.find((c) => c.name === formData.country)?.flag}
                    </span>
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      {selectedCountryDDI}
                    </span>
                  </>
                )}
                {!formData.country && (
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    DDI
                  </span>
                )}
              </div>
              <Input
                name="phoneNumber"
                placeholder="Número"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!formData.country || loading}
                className="flex-1 text-sm sm:text-base"
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

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    termsAccepted: checked === true,
                  }))
                }
                disabled={loading}
              />
              <label
                htmlFor="terms"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aceito os{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-accent hover:underline"
                  disabled={loading}
                >
                  Termos e Condições
                </button>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>

            <div className="text-center text-sm">
              Já tem conta?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Faça login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Terms and Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Termos e Condições</DialogTitle>
            <DialogDescription>
              Por favor, leia atentamente os nossos termos e condições
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">1. Aceitação dos Termos</h3>
              <p className="text-muted-foreground">
                Ao utilizar esta plataforma, você concorda em cumprir e estar
                vinculado aos seguintes termos e condições de uso. Se você não
                concordar com qualquer parte destes termos, não deverá usar
                nossos serviços.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Uso do Serviço</h3>
              <p className="text-muted-foreground">
                Você concorda em usar o serviço apenas para fins legais e de
                acordo com todas as leis e regulamentos aplicáveis. Você não
                deve usar o serviço de qualquer forma que possa danificar,
                desabilitar, sobrecarregar ou prejudicar nossos servidores ou
                redes.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Conta de Usuário</h3>
              <p className="text-muted-foreground">
                Você é responsável por manter a confidencialidade de sua conta e
                senha. Você concorda em aceitar a responsabilidade por todas as
                atividades que ocorrem sob sua conta.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Privacidade</h3>
              <p className="text-muted-foreground">
                Respeitamos sua privacidade e estamos comprometidos em proteger
                seus dados pessoais. Coletamos e processamos informações de
                acordo com nossa Política de Privacidade.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Modificações</h3>
              <p className="text-muted-foreground">
                Reservamo-nos o direito de modificar estes termos a qualquer
                momento. Continuando a usar o serviço após tais modificações,
                você concorda em estar vinculado aos termos revisados.
              </p>
            </section>
          </div>

          <DialogFooter>
            <Button onClick={handleAcceptTerms} className="w-full sm:w-auto">
              Aceitar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
