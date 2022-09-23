import { useAuth0 } from "@auth0/auth0-react"
import { FC, useEffect, useState } from "react"
import { Drink } from "../types/types"
import { deleteDrink, updateDrink } from "../utils/ApiMethods"
import { colorNames, colourNameToHex } from "../utils/ColorNameToHex"
import useStore from "../zustandStore/store"

interface Props {
  drink: Drink
  updateDrinks: () => void
}


const DrinkComponent: FC<Props> = ({ drink, updateDrinks }) => {
  const { isAuthenticated } = useAuth0()
  const [divisions, setDivisions] = useState<number>(0)
  const [detailsOpened, setDetailsOpened] = useState<boolean>(false)
  const [role, token] = useStore(state => [state.role, state.token])
  const [title, setTitle] = useState<string>(drink.title)
  const [originTitle, setOriginTitle] = useState<string>(drink.title)
  const [originalRecipes, setOriginalRecipes] = useState<{
    name?: string | undefined
    color: string
    parts: number
  }[]>(drink.recipe)

  const [recipes, setRecipes] = useState<{
    name?: string | undefined
    color: string
    parts: number
  }[]>(drink.recipe)


  const addLiquid = () => {
    setRecipes([...recipes, { name: "empty", color: "#ffffff", parts: 0 }])
  }

  const deleteLiquid = () => {
    setRecipes(recipes.slice(0, -1))
  }

  const deleteDrink_ = () => {
    deleteDrink(token!, drink.id.toString())
      .then(res => {
        if (res) {
          setDetailsOpened(false)
          updateDrinks()
        } else {
          alert("an error occur")
        }
      })
  }

  const patchDrink = () => {
    updateDrink(token!, drink.id, title, JSON.stringify(recipes))
      .then(res => {
        if (res) {
          setOriginalRecipes(recipes)
          drink.title = title
          alert("updated successfully")
        } else {
          alert("an error occured")
        }
      }).catch(err => {
        alert("an error occured")
      })


  }

  useEffect(() => {
    const partsSum = drink.recipe.reduce((old, new_) => old + new_.parts, 0)
    setDivisions(partsSum)
  }, [])



  return (
    <>
      <div className={`${isAuthenticated ? "hover:cursor-pointer" : ""}`}>
        <div onClick={() => {
          setDetailsOpened(true)
        }} className="flex flex-col justify-end mx-auto rounded-md h-[100px] border-[1px] border-gray-600 w-[70px] pt-4">
          {originalRecipes.map((el, index) => (
            <div key={index} style={{
              background: `${el.color}`,
              height: `${(100 / divisions) * el.parts}px`
            }} />
          ))}
        </div>
        <div className="text-center font-mono font-blod">
          {drink.title}
        </div>
      </div>

      {(role === "manager" || role === "barista") && detailsOpened ? (
        <>
          {/* cover layer */}
          <div onClick={() => {
            setDetailsOpened(false)
            setRecipes(originalRecipes)
            setTitle(originTitle)
          }} className={`bg-black bg-opacity-70 fixed top-0 left-0 w-[100vw] h-[100vh] z-10`} />

          {/* details div */}
          <div className="flex flex-col justify-between fixed top-20 mx-auto bg-white max-w-[600px] min-h-[300px] py-6 px-2 rounded-md z-20">
            <div className="flex gap-3 pl-2">
              <h3 className="font-bold font-lg">title : </h3>
              <input type="text" value={title} onChange={(e) => role === "manager" ? setTitle(e.currentTarget.value) : null} />
            </div>
            <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="py-3 px-2">name</th>
                  <th className="py-3 px-2">color</th>
                  <th className="py-3 px-2">parts</th>
                  <th className="w-[30px]"></th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((el, index) => (
                  <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th className="py-4 px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"><input className="w-[90%]" type="text" value={el.name} onChange={(e) => {
                      if (role === "manager") {
                        const copy = [...recipes]
                        copy[index].name = e.currentTarget.value
                        setRecipes(copy)
                      }
                    }} /></th>
                    <td className="py-4 px-2"><input className="w-[90%]" type="color" value={colourNameToHex(el.color as colorNames)} onChange={(e) => {
                      if (role === "manager") {
                        const copy = [...recipes]
                        copy[index].color = e.currentTarget.value
                        setRecipes(copy)
                      }
                    }} /></td>
                    <td className="py-4 px-2"><input className="w-[90%]" type="number" value={el.parts} onChange={(e) => {
                      if (role === "manager") {
                        const copy = [...recipes]
                        copy[index].parts = Number(e.currentTarget.value)
                        setRecipes(copy)
                      }
                    }} /></td>
                    <td
                      onClick={deleteLiquid}
                      className="text-red-600 font-bold text-lg hover:cursor-pointer">-</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {role === "manager" ? (
              <div
                className="flex justify-around ">
                <button
                  onClick={patchDrink}
                  disabled={recipes.length && title ? false : true}
                  className={`${recipes.length && title ? "hover:bg-orange-700 bg-orange-500" : "bg-gray-500"}  text-white font-bold py-2 px-4 rounded`}>
                  Update Drink
                </button>

                <button
                  onClick={addLiquid}
                  className="hover:bg-blue-700 bg-blue-500 text-white font-bold py-2 px-4 rounded">
                  Add ingredient
                </button>

                <button
                  onClick={deleteDrink_}
                  className="hover:bg-red-700 bg-red-500 text-white font-bold py-2 px-4 rounded">
                  Delete Drink
                </button>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </>
  )
}

export default DrinkComponent