import os
import json
import sys

FILE_PATH = "./data/data.json"
data = None


"""
 json = { type: { category: [{card}...], category2...}, type2 ...}
"""
def load_json_file(filepath):
    if not os.path.exists(filepath):
        print(f"File '{filepath}' not found")
        return sys.exit(1)
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

COMMANDS = """
    Options:
    [1] - ADD type
    [2] - ADD category
    [3] - ADD card
    [4] - REMOVE type
    [5] - REMOVE category
    [6] - REMOVE card
    [7] - UPDATE card
    [8] - PRINT data
"""



COMMANDS_LIST = []

def print_options(string):
    print(string)


# add new type X
# add new category X
# add new card X
# remove type x
# remove category x
# remove cards x
# udpate cards 
# print cards 

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

def user_string_match(options):
    while True:
        print(f"Select between those options: {options}")
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
            if user_option > options_nbr:
                print(f"Select between 0 and {options_nbr}")
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

# select a type
# select a category
# select a card

# print and validate 

# save json 

def update_card():
    if len(data) == 0:
        print("Nothing to update yet")
        return

    selected_type = user_string_match(data.keys()) 
    if len(selected_type) == 0:
        print("The type is empty, nothing to update!")
        return 
    
    selected_category = user_string_match(selected_type.keys())
    if len(selected_category) == 0:
        print("Empty category, nothing to update")
        return 
    
    selected_english_name = user_string_match(get_english_keys(selected_category))
    selected_card = get_card_by_english(selected_english_name)

    # loop in each field, print and ask if want to update
    # if yes apply changes and confirms
    # last confirms at the end 
    update_dic()


def remove_type():
    if len(data) == 0:
        print("Nothing to remove yet")
        return
    
    type_to_remove = user_string_match(data.keys())
    # you sure you want to delete and do the same with adding or updating
    del_dic(data, type_to_remove)

def remove_category():
    if len(data) == 0:
        print("Nothing to remove yet")
        return
    
    selected_type = user_string_match(data.keys()) 
    if len(selected_type) == 0:
        print("The type is empty, nothing to delete!")
        return 
    
    selected_category = user_string_match(selected_type.keys())
    del_dic(selected_type, selected_category)

def remove_card():
    if len(data) == 0:
        print("Nothing to remove yet")
        return
    
    selected_type = user_string_match(data.keys()) 
    if len(selected_type) == 0:
        print("The type is empty, nothing to delete!")
        return 
    
    selected_category = user_string_match(selected_type.keys())
    if len(selected_category) == 0:
        print("Empty category, nothing to delete")
        return 
    
    selected_english_name = user_string_match(get_english_keys(selected_category))
    selected_card = get_card_by_english(selected_english_name)

    del_list(selected_card)
# -------------------------------------------------------------------
def add_card():
    if len(data) == 0:
        print("There is no type or category yet, please create them first!")
        return
    
    selected_type = user_string_match(data.keys())
    if len(selected_type) == 0:
        print("This type has no category yet, please create one first!")
        return 
    
    selected_category = user_string_match(selected_type.keys())

    new_card = {}

    english_word = get_user_input("Type the english word of the new card")
    if check_if_card_exists( selected_category, english_word):
        print("A card with this name exists already!")
        return 
    
    new_card["english"] = english_word
    new_card["spanish"] = get_user_input("Type the spanish word")
    new_card["hasImage"] = ask_yes_or_no("Is there an image?")
    if new_card["hasImage"]:
        new_card["image"] = get_user_input("Type the image link (with extension at the end)")
    
    add_list(selected_category, new_card)

def add_category():
    if len(data) == 0:
        print("There is no type to add category on, please create one first!")
        return

    selected_type = user_string_match(data.keys()) 
    new_category = get_user_input("Type the new category name")

    if new_category in selected_type:
        print("A category with this name exists already")
        return
    
    add_dic(selected_type, new_category, [])

def add_type():
    new_type = get_user_input("Type the new type name")

    if new_type in data:
        print("A type with this name exists already")
        return
    
    add_dic(data, new_type, {})

# -------------------------------------------------------------------
# card is a dictionnary 
def removeCards(category, cards):
    for card in cards:
        if card in category:
            category.remove(card)

# category is a string representing the key
def removeCategories(type, categories):
    for category in categories:
        if category in type:
            del type[category]

# type is a string key
def removeTypes(types):
    for type in types:
        if type in data:
            del data[type]





def handle_option(user_choice, options):
    for index, option in enumerate(options):
        if index == user_choice:
            option()
            break

def main():
    data = load_json_file(FILE_PATH)
    #create empty data if no data or type or category 
    try:
        while True:
            user_input = get_input_option(COMMANDS, 8)
         
            #handle_option(user_option)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()