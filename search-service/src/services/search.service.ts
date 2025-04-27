import Search from "@/models/Search.model";

export const searchPost = async (query: string) => {
    const result = await Search.find(
            {
                $text: { $search: query },
            },
            {
                score: { $meta: "textScore" },
            }
        ).sort({ score: { $meta: "textScore" } })
        .limit(10)

         return result;
}