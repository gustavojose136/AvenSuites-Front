

'use client';

import { useRouter } from 'next/navigation';
import { useInvoice } from '@/presentation/hooks/useInvoice';
import { container } from '@/shared/di/Container';
import { InvoiceForm } from '@/presentation/components/Invoice/InvoiceForm';
import { showToast } from '@/shared/utils/toast';
import Breadcrumb from '@/components/Common/Breadcrumb';
import type { InvoiceCreateRequest } from '@/application/dto/Invoice.dto';
import type { InvoiceFormData } from '@/shared/validators/invoiceSchema';

export default function NewInvoicePage() {
  const router = useRouter();
  const { createInvoice, loading } = useInvoice(container.getInvoiceService());

  const handleSubmit = async (formData: InvoiceCreateRequest) => {
    try {
      const invoice = await createInvoice(formData);
      showToast.success(`Nota fiscal "${invoice.number || invoice.id}" criada com sucesso!`);
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar nota fiscal';
      showToast.error(message);
      throw error;
    }
  };

  return (
    <>
      <Breadcrumb
        pageName="Nova Nota Fiscal"
        pageDescription="Emitir uma nova nota fiscal no sistema"
      />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-dark dark:text-white">
              Emitir Nova Nota Fiscal
            </h1>
            <p className="text-body-color dark:text-dark-6">
              Preencha os dados abaixo para emitir uma nova nota fiscal no sistema.
            </p>
          </div>

          <InvoiceForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </section>
    </>
  );
}

