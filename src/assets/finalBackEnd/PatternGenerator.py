
# coding: utf-8



import random
import json
import re
import os
import shutil
from datetime import datetime, timedelta
from copy import deepcopy




# Reading Source Word DB file and converting and returning with Word Dictornary type.
def DBFileReading(file_path):
    # reading DB file with 'utf-8' encoding and storing in "data" variable.
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        data = file.readlines()

    word_dict = {}  # converting database entries to word dictonary.
    for word in data:
        k = word.split(',')
        word_dict[k[0]] = k[1].strip('\n')  # cleaning "\n"

    return word_dict




# This function is used to print the Gird
def print_gird():
    for x in range(gird_size):
        print('\t' * 5 + ' '.join(gird[x]))




#Here Gird will generate
def generateGird():
    global gird
    gird = [['-' for _ in range(gird_size)] for _ in range(gird_size)]




def getPattern(pattern):

    # These are the Parent Patterns Defined, If required some more type and varities of Gird you can place here but make sure the Parent Gird Size should be ONLY 9x9.
    parent_pattern_1 = [[6],[2,4,6,8],[4],[1,2,4,6,7,8],[5],[2,3,4,6,8,9],[6],[2,4,6,8],[4]] # central symmetry
    parent_pattern_2 = [[1,3,7,9],[5],[1,3,7,9],[5],[2,4,5,6,8],[5],[1,3,7,9],[5],[1,3,7,9]] # full symmetry # central symmetry
    parent_pattern_3 = [[4,5],[2,7,8],[2,4,5],[5,7,9],[1,3,7,9],[1,3,5],[5,6,8],[2,3,8],[5,6]] # full symmetry
    parent_pattern_4 = [[1,4,5,6],[5],[7,8,9],[3,7],[1,2,3],[5],[],[4,5,6],[9]] # diagonal
    #parent_pattern_5 = [[5],[5],[5],[4],[1,2,8,9],[6],[5],[5],[5]] # horizontal and vertical symmetry : 4
    parent_pattern_6 = [[5],[2,4,5,6,8],[5],[1,3,7,9],[5],[1,3,7,9],[5],[2,4,5,6,8],[5]] # central symmetry
    parent_pattern_5 = [[0,3,5,8],[0,1,7,8],[1,3,5,7],[4],[2,6],[4],[1,3,5,7],[0,1,7,8],[0,3,5,8]] # diagonal

    # List of Parent Gird Patterns
    pattern_list = [parent_pattern_1,parent_pattern_2,parent_pattern_3,parent_pattern_4,parent_pattern_5,parent_pattern_6]


    # Selection of Girds on the basis of User Input
    if pattern == "diagonal":
        selected_parent_pattern = pattern_list[4]
    elif pattern == "full_symmetry":
        selected_parent_pattern = random.choice([pattern_list[2], pattern_list[1]])
    elif pattern == "central_symmetry":
        selected_parent_pattern = random.choice([pattern_list[0],pattern_list[1],pattern_list[5]])
    elif pattern == "horizontal_symmetry" or pattern == "vertical_symmetry":
        selected_parent_pattern = pattern_list[3]
    elif pattern == "random":
        selected_parent_pattern = random.choice(pattern_list)

    ## ======================================================================== ##
    ## This is Tricky part, This will added up more pattern in Selected Parent Gird when user request is above 9X9 gird size ##

    ext_row = int((gird_size - 9)/2)
    if ext_row %2 != 0:
        ext_row = ext_row + 1
    elif (ext_row == 0) & (gird_size > 9):
        ext_row = 1
    elif gird_size != 9:
        ext_row = ext_row + 1

    new_pattern_index = []
    for row in selected_parent_pattern:
        new_index = []
        for col in row:
            new_index.append(col+ext_row)
        new_pattern_index.append(new_index)


    addon_pattern = [[random.randint(0, gird_size) for _ in range(random.randint(1,8))] for _ in range(ext_row)]

    # Developer can play this part of code to see some fancy patterns in Gird #
    new_pattern_1 = addon_pattern + new_pattern_index + addon_pattern[::-1] # horizontal Symmetry
    new_pattern_2 = addon_pattern + new_pattern_index + [addon_pattern[i][::-1] for i in range(len(addon_pattern))] # horzontal same symmetry
    new_pattern_3 = addon_pattern + new_pattern_index + [addon_pattern[i][::-1] for i in range(len(addon_pattern))][::-1] # horzontal mirror symmetry

    new_pattern_final = random.choice([new_pattern_1, new_pattern_2, new_pattern_3])  # Here final Gird pattern is calculated and wil be returned

    return new_pattern_final




## ================================================================================= ##
# This Function Will Look for all Avaiable Across Spaces in Gird.
# It will Fill the Girds in Across
# It will keep Note on Across Words index (row, col)

def getFillAcroosWords():
    # getting word len at each row of gird, it is used for searching word of give lenght in database
    across_words_filler = []
    for i in range(gird_size):
        row_data = "".join(gird[i]).split('0')
        for col in row_data:
            if len(col)>=min_word_len_db:
                word_size = col.count('-')
                across_words_filler.append([i,word_size])

    # getting word len at each column of gird, it is used for searching word of give lenght in database
    global down_words_filler, across_word_lengths, across_word_index, across_filling_words
    down_words_filler = []
    for i in range(gird_size):
        col_data = "".join([row[i] for row in gird]).split('0')
        for col in col_data:
            if len(col)>=min_word_len_db:
                word_size = col.count('-')
                down_words_filler.append([i,word_size])

    # select word of lenght "word_thr" applied for ROW
    across_word_lengths = []
    for i in across_words_filler:
        across_word_lengths.append(i[1])

    required_words = {}
    for word_thr in set(across_word_lengths):
        required_words[word_thr] = [word for word in list(word_data.keys()) if len(word) == word_thr]


    # Selecting Randomly Across Words from given database words.
    across_word_index = []              # across words index [row, col]
    across_filling_words = []           # across words used to fill the gird
    for i in range(gird_size):
        required_row_pattern = [_ for _ in "".join(gird[i]).split('0') if len(_)> 1]
        for row_pattern in required_row_pattern:
            col_index = "".join(gird[i]).find(row_pattern)
            word_len = len(list(row_pattern))
            #print(required_row_pattern, i, col_index, col_index+word_len-1, word_len)
            if 2<word_len<=max_word_len_db:  # here its limit because in given database their are no words of length greater then "max_word_len_db"

                word_to_fill = list(random.choice(required_words[word_len]))
                gird[i][col_index : col_index+word_len] = word_to_fill
                across_filling_words.append("".join(word_to_fill))
                across_word_index.append([i, col_index])




## ================================================================================= ##
# This Function Will Look for all Avaiable Down Spaces in Gird.
# It will Fill the Girds in Down
# It will keep Note on Down Words index (row, col)

def getFilldownWords():
    # select word of lenght "word_thr" applied for COL
    global down_word_lengths,  down_filling_words, down_word_index
    down_word_lengths = []
    for i in down_words_filler:
        down_word_lengths.append(i[1])

    required_words = {}
    for word_thr in set(down_word_lengths):
        required_words[word_thr] = [word for word in list(word_data.keys()) if len(word) == word_thr]

    # used to get pattern words for Col words only after filling the Across words
    def getRePattern(match_word):
        temp_word = ""
        for alpha in match_word:
            if alpha != '-':
                temp_word += "(" + alpha + ")"
            else:
                temp_word += "."
        return temp_word

    # Filling Down Words in Gird
    down_filling_words = []
    for i in range(gird_size):
        col_word = "".join([row[i] for row in gird]).split('0')
        d_words = []
        for match_word in col_word:
            if len(match_word) >= 3:
                pattern = getRePattern(match_word)
                for word in required_words[len(match_word)]:
                    if re.findall((pattern), word):
                        d_words.append(word)



        if len(d_words)>0:
            fill_word = random.choice(d_words)
            down_filling_words.append(fill_word)

    def filldown(fill_word, col_index, word_len, i):
        fill_word = list(fill_word)
        k = 0
        for wl in gird[col_index : col_index + word_len]:
            wl[i] = fill_word[k]
            k += 1

    down_word_index = []
    for i in range(gird_size):
        required_row_pattern = [_ for _ in "".join([row[i] for row in gird]).split('0') if len(_)>=2] ###############changes made here
        for row_pattern in required_row_pattern:
            col_index = "".join([row[i] for row in gird]).find(row_pattern)
            word_len = len(list(row_pattern))
            #print(row_pattern,col_index, word_len)
            for w in down_filling_words:
                if re.findall(getRePattern(row_pattern), w):
                    #[row[i] for row in gird][col_index : col_index + word_len] = w
                    #print(row_pattern, i, col_index, word_len)
                    filldown(w, col_index, word_len, i)
                    down_word_index.append([i,col_index])




# This function is used for Filling out the remaining Space in the Grid, After Filling Down and Across Words due to Words Shortage in database these spaces remains empty, so filling out them here.

def fillRemainingSpace():
    for i in range(gird_size):
        if '-' in gird[i]:
            indices = [i for i, x in enumerate(gird[i]) if x == "-"]
            for k in indices:
                gird[i][k] = '0'




#This function will return all Across and Down Words with Clues and Row and Column number where they are located in the Gird
def getAcrossDownWords():
    across = []
    for i in range(len(across_filling_words)):
        d = {}
        d['row'], d['col'], d['name'], d['hint'] = across_word_index[i][0], across_word_index[i][1],across_filling_words[i], word_data[across_filling_words[i]]
        across.append(d)
    temp_across = {}
    temp_across['name'] = across

    down = []
    for i in range(len(down_filling_words)):
        d = {}
        d['row'], d['col'], d['name'], d['hint'] = down_word_index[i][1], down_word_index[i][0],down_filling_words[i], word_data[down_filling_words[i]]
        down.append(d)
    temp_down = {}
    temp_down['name'] = down

    words_with_hits = {
        'Across Words' : temp_across,
        'Down Words' : temp_down
    }

    return words_with_hits


## ===================================== ##
# It will Conver Gird into required JSON Format as per front end Coding
def dataConvertor():
    id = 0
    l = []
    for row in gird:
        d = {}
        i = 'row'
        d[i] = row
        l.append(d)
        id += 1
    return l

## ===================================== ##
def customer_json():
    N = 7  # Days buffer for gird expire
    gird_generate_date = datetime.now().strftime('%Y%m%d')
    gird_expire_date = (datetime.now() - timedelta(days=N)).strftime('%Y%m%d')

    customer_required_json_format_file = {}
    customer_required_json_format_file['pml_id'] = game_id
    customer_required_json_format_file['abbr'] = 'XW'
    customer_required_json_format_file['cdate'] = gird_generate_date
    customer_required_json_format_file['region'] = 'IND'
    customer_required_json_format_file['title'] = 'crossword'
    customer_required_json_format_file['expired'] = gird_expire_date
    customer_required_json_format_file['symmtery'] = pat
    customer_required_json_format_file['gird'] = {
        'cols': gird_size,
        'rows': gird_size,
        'pzlmap': empty_gird,
        'solmap': gird}

    customer_required_json_format_file['items'] = {'clues': adw}


    with open("temp_files/crossword.txt", "w") as file:
        file.write(str(customer_required_json_format_file))


## ===================================== ##
def StartCalculation(max_down_words_thr):
    print('========= Generating Grid ==========')
    generateGird()                # generating Emtyp Gird of size "gird_size" user input.

    # selecting the Gird pattern specified by user
    generatd_pattern = getPattern(pat)

    # filling out Generated gird with Symmetry pattern specied by user.
    for i in range(gird_size):
        for j in generatd_pattern[i]:
            gird[i][j-1] = '0'         # this will be a bloackage in the Gird as per the Pattern generated.
    
    global empty_gird
    empty_gird = deepcopy(gird)
    
    #print_gird()                      # displaying gird with pattern
    #print("\n\n\n")
    getFillAcroosWords()               # Calling to find and fill Across words in Gird
    #print_gird()

    getFilldownWords()                 # Calling to find and fill Down words in Gird
    #print_gird()
    #print("\n\n\n")
    fillRemainingSpace()               # Filling out remaining Spaces in Gird
    #print_gird()                       # Displaying Final Gird Filled with Across and Down Words
    getAcrossDownWords()               # Getting the Across and Down Words Index with Clues

    # Writting JSON File of Across and Down Words with Index and Clues / Hints
    global adw, gird_with_answers


    adw = getAcrossDownWords()
    print('Gird Size {} Across words count : {} \t Down words count : {} Thr {} '.format(gird_size, len(adw['Across Words']['name']), len(adw['Down Words']['name']), max_down_words_thr))

    if max_down_words_thr <= len(adw['Down Words']['name']):
        max_down_words_thr = len(adw['Down Words']['name'])
        with open("temp_files/across_down_words_table.json", 'w', encoding='utf-8') as file:
            json.dump(adw, file, ensure_ascii=False, indent=4)


        # Writting JSON File of Fill Gird of Words
        temp_ = dataConvertor()
        gird_with_answers = {}
        gird_with_answers['hidden_words_in_gird'] = temp_
        with open("temp_files/hidden_words_in_gird.json", 'w', encoding='utf-8') as file:
                json.dump(gird_with_answers, file, ensure_ascii=False, indent=4)


        customer_json() # writting json file according to customer requirements

    return max_down_words_thr


# ============= Start of Program ================== #
file_path ="UK-DB.csv" 
json_file="across_down.json"
# source Word DB file NOTE : if given database file note opening due to "utf-8 encoding error", convert it to csv format. Before Converting file to csv format make sure their are NO Word Clues in Database having "," in them.
global game_id
game_id = 0
print("# ============== Program Started ============= #")
while True:
    if game_id == 0:
        word_data = DBFileReading(file_path)
        min_word_len_db = len(sorted(word_data, key=len, reverse=False)[1])  # getting minimum word length in given database
        max_word_len_db = len(sorted(word_data, key=len, reverse=True)[0])   # getting maximum word length in given database.
    
    
    
    if "across_down.json" in os.listdir():
        with open(json_file) as file:
            user_request_data = json.load(file)
            #print(user_request_data)
        #os.remove("frontend_user_request.json")


        ## if 1 then it will generate the Gird
        if user_request_data['posts']['stateType'] == '1':
            game_id += 1
            global gird_size, pat, theme                     # decalred it to be Global will help in code optimization and calculation
            gird_size = int(user_request_data['posts']['grid'])  # user input
            pat = user_request_data['posts']['sym_type']         # user input
            
            max_down_words_thr = 0
            for _ in range(20):
                max_down_words_thr = StartCalculation(max_down_words_thr)                          # Generating Gird of requested Size and Symmetry and Filling Out Across and Down Words.

            # moving all 3 files to location were anugular will be read them as final file
            
            shutil.move('temp_files/across_down_words_table.json', "across_down_words_table.json")
            shutil.move('temp_files/hidden_words_in_gird.json', "hidden_words_in_gird.json")
            shutil.move('temp_files/crossword.txt', "crossword.txt")
            
            
            
            # updating the State for a fresh input
            user_request_data['posts']['stateType'] = "0"
            with open(json_file,"w") as file:
                json.dump(user_request_data, file)



## =========== User request JSON File Testing ============== #
"""user_request = {
    'grid': "12",
    'sym_type':  "diagonal",
    'theme_type': "random",
    'stateType' : '1'
}

dummy = {}
dummy['posts'] = user_request 

with open('across_down.json','w') as file:
    json.dump(dummy, file)
"""


