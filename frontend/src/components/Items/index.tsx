import React from "react"

export interface ItemProp {
    id: number
    title: string
    image_url: string
}

interface ItemProps {
    item: ItemProp
    selected: number[]
    handleClick: (id:number) => void
}

const Item: React.FC<ItemProps> = ({ item, handleClick, selected }) => {
    function handleSelected() {
        handleClick(item.id)
    }
    return (
        <li className={ selected.findIndex((select) => select === item.id) >= 0 ? 'selected' : '' } onClick={handleSelected}>
            <img src={item.image_url} alt={item.title} />
            <span>{item.title}</span>
        </li>
    )
}

export default Item