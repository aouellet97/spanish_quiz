import os
import json
from copy import deepcopy

FILE_PATH = "./data/data.json"
data = None

"""
 json = { type: { category: [{card}...], category2...}, type2 ...}
"""
def load_json_file(filepath):
    if not os.path.exists(filepath):
        print(f"File '{filepath}' not found, created it!")
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump({}, f, indent=4)
            return ()
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def update_json():
    if not os.path.exists(FILE_PATH):
        print(f"File '{FILE_PATH}' not found!")
        return
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

COMMANDS = """
    Options:
    [1] - ADD type
    [2] - ADD category
    [3] - ADD card
    [4] - REMOVE type
    [5] - REMOVE category
    [6] - REMOVE card
    [7] - UPDATE card
"""

# -------------------------------------------------------------------
def add_dic(dic, key, val):
    dic[key] = val

def add_list(list, val):
    list.append(val)

def del_dic(dic, key):
    del dic[key]

def del_list(list, val):
    list.remove(val)

def update_dic(dic, updates):
    for k, v in updates.items():
        dic[k] = v
# -------------------------------------------------------------------
def print_options(string):
    print(string)

def get_user_input(string):
    print(string)
    return input("Type and press ENTER > ").strip()
    
def ask_yes_or_no(string):
    while True:
        print(string)
        user_input = input("Type [1] for yes / [2] for no, then press [ENTER] > ").strip()
        try:
            user_choice = int(user_input)
            if user_choice not in (1, 2):
                print(f"Select between 1 and 2!")
            else:
                return user_choice == 1
        except:
            print("Select a number!")

def user_string_match(name, options):
    while True:
        print(f"Select between those {name}: {options}")
        user_input = input("Type then press [ENTER] > ").strip()
        if user_input not in options:
            print("Type one of the following options!")
        else:
            return user_input
        
def get_input_option(string, options_nbr):
    while True:
        print_options(string)
        user_input = input("Select your option [x] and press ENTER > ").strip()
        try:
            user_option = abs(int(user_input))
            if user_option > options_nbr or user_option == 0:
                print(f"Select between 1 and {options_nbr}")
            else:
                return user_option
        except:
            print("Select a number!")
# -------------------------------------------------------------------        
def check_if_card_exists(category, english_name):
   return any(dic.get("english") == english_name for dic in category)

def get_english_keys(list):
    return [dic["english"] for dic in list if "english" in dic]

def get_card_by_english(category, english_name):
    for card in category:
        if card["english"] == english_name:
            return card
    return None
# -------------------------------------------------------------------

def get_type():
    if len(data) == 0:
        print("There is no types yet, please create one first!")
        return None
   
    return data[user_string_match("types", list(data.keys()))]

def get_category():
    selected_type = get_type()
    if selected_type == None:
        return None
    
    if len(selected_type) == 0:
        print("This type has no category yet, please create one first!")
        return None
    
    return selected_type[user_string_match("categories", list(selected_type.keys()))]

# -------------------------------------------------------------------

def update_card():
    selected_category = get_category()
    if selected_category == None:
        return "Could not update card"
    
    if len(selected_category) == 0:
        print("This category has no cards yet!")
        return "Could not update card"
    
    selected_english_name = user_string_match("english names", get_english_keys(selected_category))
    selected_card = get_card_by_english(selected_category, selected_english_name)
    
    new_card = deepcopy(selected_card)
    for k, v in selected_card.items():
        print(f"Selected Card [{k}: {v}]")
        if ask_yes_or_no(f"Do you want to modify the {k} field?"):
            while True:
                new_value = get_user_input(f"Type the new {k} value")
                print(f"{k}: {v} -> {k}: {new_value}")
                if ask_yes_or_no("Do you want to accept this modification?"):
                    new_card[k] = new_value
                    break
                else:
                    if ask_yes_or_no("Skip this field?"):
                        break
    if new_card != selected_card:
        print(f"Card: {selected_card} -> {new_card}")
        if ask_yes_or_no("Do you want to accept these changes?"):
            update_dic(selected_card, new_card)
            update_json()
            return f"Card {selected_card["english"]} updated!"

    return "Could not update card"

# -------------------------------------------------------------------

def remove_type():
    if len(data) == 0:
        print("Nothing to remove yet")
        return "Could not remove type"
    
    type_to_remove = user_string_match("types",list(data.keys()))

    if ask_yes_or_no(f"Are you sure you want to remove {type_to_remove}?"):
        del_dic(data, type_to_remove)    
        update_json()
        return f"Type {type_to_remove} removed!"
    
    return "Could not remove type"

def remove_category():
    selected_type = get_type()
    if selected_type == None:
        return "Could not remove category"
    
    if len(selected_type) == 0:
        print("This type has no category yet!")
        return "Could not remove category"
    
    selected_category = user_string_match("categories", list(selected_type.keys()))
    if ask_yes_or_no(f"Are you sure you want to remove {selected_category}?"):
        del_dic(selected_type, selected_category)
        update_json()
        return f"Category {selected_category} removed!"
    
    return "Could not remove category"
    
def remove_card():
    selected_category = get_category()
    if selected_category == None:
        return "Could not remove card"
    
    if len(selected_category) == 0:
        print("This category has no cards yet!")
        return "Could not remove card"
    
    selected_english_name = user_string_match("english names",get_english_keys(selected_category))
    selected_card = get_card_by_english(selected_category, selected_english_name)
    if ask_yes_or_no(f"Are you sure you want to remove {selected_card}?"):
        del_list(selected_category,selected_card)
        update_json()
        return f"Card {selected_card} removed!"
    
    return "Could not remove card"
    
# -------------------------------------------------------------------
def add_card():
    selected_category = get_category()
    if selected_category == None:
        return "Could not add card"
    
    new_card = {}

    english_word = get_user_input("Type the english word of the new card")
    if check_if_card_exists( selected_category, english_word):
        print("A card with this name exists already!")
        return "Could not add card"
    
    new_card["english"] = english_word
    new_card["spanish"] = get_user_input("Type the spanish word")
    new_card["hasImage"] = ask_yes_or_no("Is there an image?")
    if new_card["hasImage"]:
        new_card["image"] = get_user_input("Type the image link (with extension at the end)")
    else:
        new_card["image"] = ""
    add_list(selected_category, new_card)
    update_json()

    return f"Card {new_card} created!"

def add_category():
    selected_type = get_type()
    if selected_type == None:
        return "Could not add category"
    
    new_category = get_user_input("Type the new category name")

    if new_category in selected_type:
        print("A category with this name exists already")
        return "Could not add category"
    
    add_dic(selected_type, new_category, [])
    update_json()

    return f"Category {new_category} created!"

def add_type():
    new_type = get_user_input("Type the new type name")

    if new_type in data:
        print("A type with this name exists already")
        return "Could not add type!"
    
    add_dic(data, new_type, {})
    update_json()

    return f"Type {new_type} created!"
# -------------------------------------------------------------------

"""
def handle_option(user_choice, options):
    for index, option in enumerate(options):
        if index == user_choice:
            option()
            break
"""
def handle_option(user_input):
    result = None

    match user_input:
        case 1:
            print("\nADD type \n")
            result = add_type()
        case 2:
            print("\nADD category \n")
            result = add_category()
        case 3:
            print("\nADD card \n")
            result = add_card()
        case 4:
            print("\nREMOVE type \n")
            result = remove_type()
        case 5:
            print("\nREMOVE category \n")
            result = remove_category()
        case 6:
            print("\nREMOVE card \n")
            result = remove_card()
        case 7:
            print("\nUPDATE card \n")
            result = update_card()
        case _:
            pass

    return result

def main():
    global data
    data = load_json_file(FILE_PATH)

    try:
        while True:
            user_input = get_input_option(COMMANDS, 7)
            result = handle_option(user_input)
            print("\n" + result)
            input("\nPress Enter")
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()