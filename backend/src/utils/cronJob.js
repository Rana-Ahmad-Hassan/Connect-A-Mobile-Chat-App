import cron from "node-cron";
import { Status } from "../models/status.js";
import { supabase } from "../../supabase.js";


const SUPABASE_URL = "https://fvjjuajypppiwhrmodxj.supabase.co"

const deleteExpiredMedia = async () => {
    try {
        // Find all expired statuses in MongoDB
        const expiredStatuses = await Status.find({ expiresAt: { $lt: new Date() } });

        if (expiredStatuses.length === 0) {
            console.log("No expired statuses found.");
            return;
        }

        console.log(`Deleting ${expiredStatuses.length} expired statuses...`);

        for (const status of expiredStatuses) {
            const filePath = status.mediaUrl.replace(`${SUPABASE_URL}/storage/v1/object/public/status-media/`, "");

            const { error } = await supabase.storage.from("status-media").remove([filePath]);

            if (error) {
                console.error(`Failed to delete file: ${filePath}`, error);
            } else {
                console.log(`Deleted file: ${filePath}`);
            }
        }
        await Status.deleteMany({ expiresAt: { $lt: new Date() } });

        console.log("Expired statuses deleted successfully.");
    } catch (error) {
        console.error("Error deleting expired statuses:", error);
    }
};

cron.schedule("0 * * * *", () => {
    console.log("Running expired media cleanup job...");
    deleteExpiredMedia();
});

export default deleteExpiredMedia;
