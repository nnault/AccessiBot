"use server";
import { createClient } from "@/utils/supabase/server";
export const sendMessage = async (data: FormData) => {
    const supabase = createClient();
    const { data:user }
= await supabase.auth.getUser();

    const messageText = data.get('message') as string;
    const { data:newMessage, error } = await supabase.from('messages').insert([
        { message_text: messageText, user_id: user.user?.id, display_name: user.user?.user_metadata.displayName},
    ]);
    if (error) {
        console.error('Error sending message:', error);
    } else {
        console.log('Message sent:', newMessage);
    }
}