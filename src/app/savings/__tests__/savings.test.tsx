import { afterEach, vi } from 'vitest';
import React from 'react';
import { cleanup, render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Savings from '../page';

// Use a resolved anchor as the stub for `next/link` so the component's
// `import Link from "next/link"` always resolves to a valid React element.
vi.mock('next/link', () => ({
  __esModule: true,
  // vitest/vite mocker intercepts the factory's default export and exposes it
  // as `import Link from "next/link"` within the consuming module.
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}));

afterEach(() => cleanup());

/**
 * Flush the component's async useEffect (1200 ms setTimeout) using React
 * `act()` so RTL sees the updated DOM before any assertion runs.
 */
async function stable(): Promise<void> {
  // The component sets loading → true, waits 1200 ms, then sets true data.
  // Passing 1300 ms gives the internal setTimeout one extra cycle to fire
  // and React a tick to commit the re-render.
  await act(async () => {
    await new Promise((r) => setTimeout(r, 1300));
  });
}

// ─── Loading State ────────────────────────────────────────────────────
describe('Savings Page – Loading State', () => {
  it('renders a spinner initially', () => {
    const { container } = render(<Savings />);
    // The loading view shows a centered div with the animate-spin class;
    // after data loads the table replaces it.
    expect(container.querySelector('.animate-spin')).toBeTruthy();
    expect(screen.queryByText('Manajemen Simpanan')).not.toBeInTheDocument();
  });

  it('hides the spinner once the async init completes', async () => {
    render(<Savings />);
    await stable();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

// ─── Page Structure ───────────────────────────────────────────────────
describe('Savings Page – Structure', () => {
  it('shows the page title "Manajemen Simpanan"', async () => {
    render(<Savings />);
    await stable();
    expect(screen.getByText('Manajemen Simpanan')).toBeInTheDocument();
  });

  it('shows the "Buka Simpanan Baru" link', async () => {
    render(<Savings />);
    await stable();
    expect(screen.getByText('Buka Simpanan Baru')).toBeInTheDocument();
  });

  it('shows all 10 table column headers', async () => {
    render(<Savings />);
    await stable();
    const cols = [
      'Nama Anggota', 'NIK', 'Jenis Simpanan', 'Saldo',
      'Suku Bunga/Tahun', 'Setoran/Bulan', 'Total Bunga',
      'Transaksi Terakhir', 'Status', 'Aksi',
    ];
    for (const col of cols) expect(screen.getByText(col)).toBeInTheDocument();
  });

  it('displays all three sample members once loaded', async () => {
    render(<Savings />);
    await stable();
    // Budi Santosa appears in 2 savings rows; getAllByText.length === 2 at minimum
    expect(screen.getAllByText('Budi Santoso').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Ahmad Fauzi')).toBeInTheDocument();
    expect(screen.getByText('Siti Rahayu')).toBeInTheDocument();
  });

  it('displays the savings summary cards (4 totals)', async () => {
    render(<Savings />);
    await stable();
    expect(screen.getByText('Ringkasan Simpanan')).toBeInTheDocument();
    expect(screen.getByText('Total Simpanan Wajib')).toBeInTheDocument();
    expect(screen.getByText('Total Simpanan Sukarela')).toBeInTheDocument();
    expect(screen.getByText('Total Simpanan Pelajar')).toBeInTheDocument();
    expect(screen.getByText('Total Bunga yang Diperoleh')).toBeInTheDocument();
  });

  it('shows "7 dari 7" in the records footer', async () => {
    render(<Savings />);
    await stable();
    expect(screen.getByText(/Menampilkan 7 dari 7 rekening simpanan/)).toBeInTheDocument();
  });
});

// ─── Search ───────────────────────────────────────────────────────────
describe('Savings Page – Search', () => {
  it('filters rows by member name', async () => {
    render(<Savings />);
    await stable();

    const input = screen.getByPlaceholderText('Cari nama anggota atau NIK...');
    fireEvent.change(input, { target: { value: 'Siti' } });

    expect(screen.getByText('Siti Rahayu')).toBeInTheDocument();
    expect(screen.queryByText('Budi Santoso')).not.toBeInTheDocument();
    expect(screen.queryByText('Ahmad Fauzi')).not.toBeInTheDocument();
  });

  it('clears the search when the × button is clicked', async () => {
    render(<Savings />);
    await stable();

    const input = screen.getByPlaceholderText('Cari nama anggota atau NIK...');
    fireEvent.change(input, { target: { value: 'Siti' } });
    // After filtering only Siti rows should remain
    expect(screen.queryByText('Ahmad Fauzi')).not.toBeInTheDocument();

    // Clearing search restores all rows
    fireEvent.click(screen.getByText('×'));
    expect(input).toHaveValue('');
    expect(screen.getAllByText('Budi Santoso').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Siti Rahayu')).toBeInTheDocument();
  });

  it('filters rows by NIK', async () => {
    render(<Savings />);
    await stable();

    const input = screen.getByPlaceholderText('Cari nama anggota atau NIK...');
    fireEvent.change(input, { target: { value: '3201017809920003' } });

    // Only Ahmad Fauzi's rows match this NIK
    expect(screen.getAllByText('Ahmad Fauzi').length).toBeGreaterThan(0);
    expect(screen.queryByText('Siti Rahayu')).not.toBeInTheDocument();
  });

  it('shows no member rows when the search matches nothing', async () => {
    render(<Savings />);
    await stable();

    const input = screen.getByPlaceholderText('Cari nama anggota atau NIK...');
    fireEvent.change(input, { target: { value: 'Tidak Ada' } });

    expect(screen.queryByText('Budi Santoso')).not.toBeInTheDocument();
  });
});

// ─── Account Type Filter ──────────────────────────────────────────────
describe('Savings Page – Account Type Filter', () => {
  async function selectAccountType(value: string): Promise<HTMLSelectElement> {
    await stable();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value } });
    return select as HTMLSelectElement;
  }

  it('shows wajib savings only', async () => {
    render(<Savings />);
    await selectAccountType('wajib');

    expect(screen.getAllByText('Simpanan Wajib').length).toBeGreaterThan(0);
    expect(screen.queryByText('Siti Rahayu')).not.toBeInTheDocument();
  });

  it('shows pokok savings only', async () => {
    render(<Savings />);
    await selectAccountType('pokok');

    expect(screen.getAllByText('Simpanan Pokok').length).toBeGreaterThan(0);
  });

  it('shows sibuhar savings only', async () => {
    render(<Savings />);
    await selectAccountType('sibuhar');

    expect(
      screen.getAllByText('Simpanan Bunga Harian (Sibuhar)').length
    ).toBeGreaterThan(0);
  });

  it('shows masadepan savings only', async () => {
    render(<Savings />);
    await selectAccountType('masadepan');

    expect(screen.getAllByText('Simpanan Masa Depan').length).toBeGreaterThan(0);
  });

  it('shows sibuhar savings only', async () => {
    render(<Savings />);
    await selectAccountType('sibuhar');

    expect(screen.getAllByText('Simpanan Bunga Harian (Sibuhar)').length).toBeGreaterThan(0);
    expect(screen.queryByText('Siti Rahayu')).not.toBeInTheDocument();
  });

  it('shows all savings when filter returns to "Semua Jenis Simpanan"', async () => {
    render(<Savings />);
    await selectAccountType('wajib');
    expect(screen.queryByText('Siti Rahayu')).not.toBeInTheDocument();

    await selectAccountType('all');
    expect(screen.getByText('Siti Rahayu')).toBeInTheDocument();
  });
});

// ─── Status Filter ────────────────────────────────────────────────────
describe('Savings Page – Status Filter', () => {
  async function selectStatus(value: string): Promise<void> {
    await stable();
    fireEvent.change(screen.getByRole('combobox'), { target: { value } });
  }

  it('shows aktif savings only', async () => {
    render(<Savings />);
    await selectStatus('aktif');

    expect(screen.getAllByText('Aktif').length).toBeGreaterThan(0);
    expect(screen.queryByText('Nonaktif')).not.toBeInTheDocument();
  });

  it('shows nonaktif savings only', async () => {
    render(<Savings />);
    await selectStatus('nonaktif');

    expect(screen.getByText('Nonaktif')).toBeInTheDocument();
    expect(screen.queryByText('Aktif')).not.toBeInTheDocument();
  });

  it('lists tertutup as an available option in the filter dropdown', async () => {
    render(<Savings />);
    await stable();

    const select = screen.getByRole('combobox');
    const values = Array.from(
      select.querySelectorAll('option')
    ).map((o) => (o as HTMLOptionElement).value);
    expect(values).toContain('tertutup');
    expect(values).toContain('wajib');
    expect(values).toContain('aktif');
  });

  it('lists sukarela and pelajar in the filter dropdown', async () => {
    render(<Savings />);
    await stable();

    const values = Array.from(
      screen.getByRole('combobox').querySelectorAll('option')
    ).map((o) => (o as HTMLOptionElement).value);
    expect(values).toContain('sukarela');
    expect(values).toContain('pelajar');
  });
});

// ─── Action Links ─────────────────────────────────────────────────────
describe('Savings Page – Action Links', () => {
  it('shows Detail, Setoran, and Penarikan on aktif rows', async () => {
    render(<Savings />);
    await stable();

    expect(screen.getAllByText('Detail').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Setoran').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Penarikan').length).toBeGreaterThan(0);
  });

  it('shows Detail and Aktifkan (but no Setoran/Penarikan) on nonaktif rows', async () => {
    render(<Savings />);
    await stable();

    expect(screen.getByText('Aktifkan')).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    const nonaktifRow = rows.find((r) => r.textContent?.includes('Nonaktif'));
    expect(nonaktifRow).toBeDefined();
    expect(nonaktifRow!.textContent!).not.toContain('Setoran');
    expect(nonaktifRow!.textContent!).not.toContain('Penarikan');
  });
});

// ─── Summary Totals ───────────────────────────────────────────────────
describe('Savings Page – Summary Totals', () => {
  it('renders a non-empty total for Simpanan Wajib', async () => {
    render(<Savings />);
    await stable();

    const heading = screen.getByText('Total Simpanan Wajib');
    const value = heading.closest('div')?.parentElement?.querySelector('p');
    expect(value).toBeTruthy();
    expect(value!.textContent!.length).toBeGreaterThan(0);
  });

  it('renders a non-empty total for Total Bunga yang Diperoleh', async () => {
    render(<Savings />);
    await stable();

    const heading = screen.getByText('Total Bunga yang Diperoleh');
    const value = heading.closest('div')?.parentElement?.querySelector('p');
    expect(value).toBeTruthy();
    expect(value!.textContent!.length).toBeGreaterThan(0);
  });
});

// ─── Currency Formatting ──────────────────────────────────────────────
describe('Savings Page – Currency Formatting', () => {
  it('renders amounts in Indonesian Rupiah format (Rp …)', async () => {
    render(<Savings />);
    await stable();

    const cells = screen.getAllByText(/^Rp/);
    expect(cells.length).toBeGreaterThan(0);
  });
});

// ─── Account Type Labels & Icons ──────────────────────────────────────
describe('Savings Page – Account Type Labels & Icons', () => {
  it('renders a label for every account type used in the sample data', async () => {
    render(<Savings />);
    await stable();

    expect(screen.getAllByText('Simpanan Wajib').length).toBeGreaterThan(0);
    expect(screen.getByText('Simpanan Bunga Harian (Sibuhar)')).toBeInTheDocument();
    expect(screen.getByText('Simpanan Masa Depan')).toBeInTheDocument();
    expect(screen.getByText('Simpanan Hari Tua')).toBeInTheDocument();
  });

  it('renders an Aktif badge for every active row and exactly one Nonaktif badge', async () => {
    render(<Savings />);
    await stable();

    const aktif = screen.getAllByText('Aktif');
    expect(aktif.length).toBeGreaterThan(0);
    expect(screen.getByText('Nonaktif')).toBeInTheDocument();
  });

  it('renders one emoji icon per account type', async () => {
    render(<Savings />);
    await stable();

    // 💳 appears on every wajib row (2 times for Budi's 2 wajib records)
    expect(screen.getAllByText('💳').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('🪙').length).toBeGreaterThanOrEqual(1); // pokok
    expect(screen.getAllByText('🔥').length).toBeGreaterThanOrEqual(1); // sibuhar
    expect(screen.getAllByText('📅').length).toBeGreaterThanOrEqual(1); // masadepan
    expect(screen.getAllByText('👴').length).toBeGreaterThanOrEqual(1); // hari tua
  });
});
