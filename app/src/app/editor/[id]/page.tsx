import { EditorLayout } from "@/layout/EditorLayout";

const Editor = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id
    return (
        <EditorLayout id={id} />
    )
}

export default Editor