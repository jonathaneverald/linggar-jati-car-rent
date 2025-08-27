import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const TermsAndConditions = () => {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-6 text-center">SYARAT & KETENTUAN SEWA MOBIL – LINGGAR JATI RENT CAR</h1>
                    <h2 className="text-xl font-semibold mb-4">Pernyataan Sewa Mobil</h2>
                    <p className="mb-4">Dengan menyewa mobil, penyewa dianggap menyetujui hal-hal berikut:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Mobil disewa dalam kondisi baik dan layak pakai.</li>
                        <li>Penyewa bertanggung jawab atas mobil selama masa sewa. Jika terjadi kerusakan/hilang, maka tanggung jawab tetap pada penyewa.</li>
                        <li>Mobil tidak boleh digunakan untuk kegiatan ilegal seperti balapan, kejahatan, atau digadaikan.</li>
                        <li>Penyewa tidak diperbolehkan menggunakan mobil untuk transportasi umum (taksi/ojek online).</li>
                        <li>Jika masa sewa melebihi kesepakatan, penyewa wajib memberikan informasi kepada pihak rental.</li>
                        <li>Apabila keterlambatan pengembalian mobil terjadi tanpa pemberitahuan, akan dikenakan sanksi.</li>
                        <li>Apabila selama masa sewa mobil terkena tilang/ETLE, tanggung jawab sepenuhnya ada pada penyewa.</li>
                    </ul>

                    <br />

                    <h2 className="text-xl font-semibold mb-4">Sewa Mobil Lepas Kunci (Tanpa Sopir)</h2>
                    <ul className="list-disc pl-6 space-y-2 mb-8">
                        <li>Penyewa wajib mengisi Form Biodata dan Form Sewa Mobil.</li>
                        <li>Melampirkan fotokopi ID Card berupa: KTP, KK, SIM A, dan NPWP. (KTP asli akan disimpan selama masa sewa).</li>
                        <li>Dalam kondisi tertentu, penyewa diminta menunjukkan data tambahan seperti foto buku tabungan, ATM, kartu kredit, atau dokumen pendukung lainnya.</li>
                        <li>Bersedia untuk disurvei alamat tempat tinggal atau kantor.</li>
                        <li>Bersedia difoto bersama pihak rental dan unit kendaraan saat serah terima mobil.</li>
                        <li>Untuk penyewa luar domisili Palangka Raya, wajib memiliki penjamin yang berdomisili di Palangka Raya.</li>
                        <li>Pembayaran dilakukan di awal melalui transfer bank, internet banking, mobile banking, atau mesin EDC.</li>
                        <li>Bila calon penyewa tidak dapat memenuhi syarat tertentu, silakan hubungi pihak rental untuk solusi lebih lanjut.</li>
                    </ul>

                    <br />

                    <h2 className="text-xl font-semibold mb-4">Ketentuan Sewa Mobil Dengan Sopir (Driver)</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Penyewa hanya menggunakan jasa mobil & driver untuk keperluan yang telah disepakati di awal.</li>
                        <li>Perubahan rute atau waktu di luar kesepakatan harus dikonfirmasi kepada pihak rental.</li>
                        <li>Penyewa tidak diperkenankan menyuruh driver melakukan tindakan yang membahayakan, melanggar hukum, atau di luar batas kewajaran.</li>
                        <li>Untuk perjalanan luar kota, biaya makan dan penginapan sopir menjadi tanggung jawab penyewa (kecuali ada perjanjian berbeda).</li>
                        <li>Sopir berhak menolak mengemudi jika dalam kondisi lelah atau cuaca ekstrem demi keselamatan.</li>
                        <li>Jika terjadi kejadian darurat (kecelakaan, kerusakan, dll), penyewa wajib segera menghubungi pihak rental.</li>
                        <li>Keterlambatan pengembalian atau perpanjangan sewa wajib diinformasikan sebelumnya.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default TermsAndConditions;
