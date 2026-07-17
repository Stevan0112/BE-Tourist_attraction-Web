import prisma from "../prisma.js";

export const calculateSAW = async () => {
    const data = await prisma.$queryRawUnsafe<any[]>(`
        SELECT
            t.id_tmpt_wst,
            t.nama_tempat,
            t.kategori,
            t.biaya,
            r.wahana,
            r.kebersihan,
            r.spot_foto,
            r.popularitas
        FROM tempat_wisata t
        JOIN vw_rating r
            ON t.id_tmpt_wst = r.id_tmpt_wst
    `);

    const kriteria = await prisma.kriteria.findMany();

    const bobot = Object.fromEntries(
        kriteria.map((k) => [k.nama_kriteria.toLowerCase(), Number(k.bobot)])
    );

    const maxWahana = Math.max(...data.map(d => Number(d.wahana)));
    const maxKebersihan = Math.max(...data.map(d => Number(d.kebersihan)));
    const maxSpotFoto = Math.max(...data.map(d => Number(d.spot_foto)));
    const maxPopularitas = Math.max(...data.map(d => Number(d.popularitas)));

    const minBiaya = Math.min(...data.map(d => Number(d.biaya)));

    const hasil = data.map((d) => {
        const nBiaya = minBiaya / Number(d.biaya);

        const nWahana = Number(d.wahana) / maxWahana;

        const nKebersihan =
            Number(d.kebersihan) / maxKebersihan;

        const nSpotFoto =
            Number(d.spot_foto) / maxSpotFoto;

        const nPopularitas =
            Number(d.popularitas) / maxPopularitas;

        const skor =
            (nBiaya * (bobot["harga"] ?? 0)) +
            (nWahana * (bobot["wahana"] ?? 0)) +
            (nKebersihan * (bobot["kebersihan"] ?? 0)) +
            (nSpotFoto * (bobot["spot_foto"] ?? 0)) +
            (nPopularitas * (bobot["popularitas"] ?? 0));
        return {
            ...d,

            normalisasi: {
                biaya: Number(nBiaya.toFixed(4)),
                wahana: Number(nWahana.toFixed(4)),
                kebersihan: Number(nKebersihan.toFixed(4)),
                spot_foto: Number(nSpotFoto.toFixed(4)),
                popularitas: Number(nPopularitas.toFixed(4))
            },

            skor: Number(skor.toFixed(4))
        };
    });

    // Bisa pilih salah satu dari dua output berikut:
    // 1
    hasil.sort((a, b) => b.skor - a.skor);
    return hasil.map((item, index) => ({
        ranking: index + 1,

        ...item
    }));

    // 2
    // return {
    //     bobot,
    //     hasil: hasil
    //         .sort((a, b) => b.skor - a.skor)
    //         .map((item, index) => ({
    //             ranking: index + 1,
    //             ...item
    //         }))
    // };
};