import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const getDateFormatted = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const dateString = `${year}${month}${day}`;
    return dateString
}
export async function loadData(client: S3Client, prefix: string,
    filename: string, dateIsName: boolean = false,
    returnDate = false) {
    for (let i = 0; i < 30; i++) {
        const currentDate = new Date();

        currentDate.setDate(currentDate.getDate() - i);
        const dateString = getDateFormatted(currentDate)

        var suffix = ''
        if (dateIsName)
            suffix = `${dateString}${filename}`
        else {
            suffix = `${dateString}/${filename}`
        }

        console.log(`Trying s3 folder astro_trades/${dateString}...`)
        const command = new GetObjectCommand({
            Bucket: 'incioman-data-analysis',
            Key: `${prefix}${suffix}`,
        });

        try {
            const response = await client.send(command);
            // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
            const str = await response?.Body?.transformToString();
            if (str && !returnDate) return JSON.parse(str)
            else return dateString
        } catch (err) {
            console.error(err);
        }
    }
};
