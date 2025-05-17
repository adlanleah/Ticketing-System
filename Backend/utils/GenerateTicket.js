import QRCode from 'qrcode';

const generateQR = async (data) => {
    try {
        return await QRCode.toDataURL(data);
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw err;
    }
};

export default generateQR;
